import type { BookingRepository } from "../repositories/BookingRepository"
import type { EventRepository } from "../repositories/EventRepository"
import type { TicketTypeRepository } from "../repositories/TicketTypeRepository"
import type { SeatRepository } from "../repositories/SeatRepository"
import type { Booking } from "../entities/Booking"
import { EventType } from "../entities/Event"
import { TicketTypeName } from "../entities/TicketType"
import { BookingStatus as BookingStatusEnum } from "../entities/Booking"
// import { BookingStatus as BookingStatusEnum } from "../entities/BookingStatus" // Import BookingStatus

export interface BookTicketRequest {
  userId: string
  eventId: string
  ticketTypeId: string
  quantity: number
  seatNumbers?: string[] // For seminar seat selection
  visitSchedule?: Date // For VIP users
}

export class BookTicket {
  constructor(
    private bookingRepository: BookingRepository,
    private eventRepository: EventRepository,
    private ticketTypeRepository: TicketTypeRepository,
    private seatRepository: SeatRepository,
  ) {}

  async execute(request: BookTicketRequest): Promise<Booking> {
    // Get event and ticket type details
    const event = await this.eventRepository.findById(request.eventId)
    if (!event) {
      throw new Error("Event tidak ditemukan")
    }

    const ticketType = await this.ticketTypeRepository.findById(request.ticketTypeId)
    if (!ticketType) {
      throw new Error("Tipe tiket tidak ditemukan")
    }

    // Apply business rules
    await this.validateBookingRules(request, event.type, ticketType.name)

    // Handle seat selection for seminars
    if (event.type === EventType.SEMINAR && request.seatNumbers) {
      await this.handleSeminarSeatBooking(request)
    }

    // Create booking
    const totalPrice = ticketType.price * request.quantity

    const booking = await this.bookingRepository.create({
      userId: request.userId,
      eventId: request.eventId,
      ticketTypeId: request.ticketTypeId,
      quantity: request.quantity,
      totalPrice,
      status: BookingStatusEnum.PENDING, // Use BookingStatusEnum
      bookingDate: new Date(),
      seatNumbers: request.seatNumbers,
      visitSchedule: request.visitSchedule,
    })

    // Update ticket sold count
    await this.ticketTypeRepository.update(request.ticketTypeId, {
      sold: ticketType.sold + request.quantity,
    })

    return booking
  }

  private async validateBookingRules(
    request: BookTicketRequest,
    eventType: EventType,
    ticketTypeName: TicketTypeName,
  ): Promise<void> {
    // BR-1: No double booking for seminars
    if (eventType === EventType.SEMINAR) {
      const hasExistingBooking = await this.bookingRepository.checkDoubleBooking(request.userId, request.eventId)
      if (hasExistingBooking) {
        throw new Error("Anda sudah memesan tiket untuk seminar ini")
      }
    }

    // BR-4: Maximum 5 tickets per concert
    if (eventType === EventType.CONCERT) {
      const currentBookingCount = await this.bookingRepository.getUserBookingCount(request.userId, request.eventId)

      if (currentBookingCount + request.quantity > 5) {
        throw new Error("Maksimal 5 tiket per konser")
      }
    }

    // BR-3: Check quota availability
    const ticketType = await this.ticketTypeRepository.findById(request.ticketTypeId)
    if (!ticketType) {
      throw new Error("Tipe tiket tidak ditemukan")
    }

    if (ticketType.sold + request.quantity > ticketType.quota) {
      throw new Error("Kuota tiket tidak mencukupi")
    }
  }

  private async handleSeminarSeatBooking(request: BookTicketRequest): Promise<void> {
    if (!request.seatNumbers || request.seatNumbers.length !== request.quantity) {
      throw new Error("Jumlah kursi harus sesuai dengan jumlah tiket")
    }

    // Check if seats are available
    const availableSeats = await this.seatRepository.findAvailableSeats(
      request.eventId,
      TicketTypeName.REGULAR, // Seminars typically have regular seating
    )

    const availableSeatNumbers = availableSeats.map((seat) => seat.seatNumber)
    const unavailableSeats = request.seatNumbers.filter((seatNumber) => !availableSeatNumbers.includes(seatNumber))

    if (unavailableSeats.length > 0) {
      throw new Error(`Kursi ${unavailableSeats.join(", ")} sudah dipesan`)
    }

    // Reserve the seats
    const seatIds = availableSeats
      .filter((seat) => request.seatNumbers!.includes(seat.seatNumber))
      .map((seat) => seat.id)

    await this.seatRepository.reserveSeats(seatIds, request.userId)
  }
}
