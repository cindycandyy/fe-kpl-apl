import type { SeatRepository } from "../repositories/SeatRepository"
import type { EventRepository } from "../repositories/EventRepository"
import type { BookingRepository } from "../repositories/BookingRepository"
import type { Seat } from "../entities/Seat"
import { EventType } from "../entities/Event"

export interface SelectSeminarSeatRequest {
  userId: string
  eventId: string
  seatNumbers: string[]
}

export class SelectSeminarSeat {
  constructor(
    private seatRepository: SeatRepository,
    private eventRepository: EventRepository,
    private bookingRepository: BookingRepository,
  ) {}

  async execute(request: SelectSeminarSeatRequest): Promise<Seat[]> {
    // Validate event is a seminar
    const event = await this.eventRepository.findById(request.eventId)
    if (!event) {
      throw new Error("Event tidak ditemukan")
    }

    if (event.type !== EventType.SEMINAR) {
      throw new Error("Pemilihan kursi hanya tersedia untuk seminar")
    }

    // BR-1: Check for double booking - user can't book same seminar twice
    const hasExistingBooking = await this.bookingRepository.checkDoubleBooking(request.userId, request.eventId)
    if (hasExistingBooking) {
      throw new Error("Anda sudah memesan tiket untuk seminar ini")
    }

    // Get available seats
    const availableSeats = await this.seatRepository.findByEventId(request.eventId)
    const requestedSeats = availableSeats.filter(
      (seat) => request.seatNumbers.includes(seat.seatNumber) && !seat.isBooked,
    )

    // Validate all requested seats are available
    if (requestedSeats.length !== request.seatNumbers.length) {
      const unavailableSeats = request.seatNumbers.filter(
        (seatNumber) => !requestedSeats.some((seat) => seat.seatNumber === seatNumber),
      )
      throw new Error(`Kursi ${unavailableSeats.join(", ")} tidak tersedia`)
    }

    return requestedSeats
  }
}
