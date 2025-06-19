import type { EventRepository } from "../repositories/EventRepository"
import type { TicketTypeRepository } from "../repositories/TicketTypeRepository"
import type { BookingRepository } from "../repositories/BookingRepository"
import { EventType } from "../entities/Event"
import { TicketTypeName } from "../entities/TicketType"

export interface ValidateConcertBookingRequest {
  userId: string
  eventId: string
  ticketTypeId: string
  quantity: number
}

export class ValidateConcertBooking {
  constructor(
    private eventRepository: EventRepository,
    private ticketTypeRepository: TicketTypeRepository,
    private bookingRepository: BookingRepository,
  ) {}

  async execute(request: ValidateConcertBookingRequest): Promise<boolean> {
    const event = await this.eventRepository.findById(request.eventId)
    if (!event || event.type !== EventType.CONCERT) {
      throw new Error("Event konser tidak ditemukan")
    }

    // BR-2: Validate concert has three ticket categories
    const ticketTypes = await this.ticketTypeRepository.findByEventId(request.eventId)
    const requiredTypes = [TicketTypeName.REGULAR, TicketTypeName.VIP, TicketTypeName.VVIP]
    const hasAllTypes = requiredTypes.every((type) => ticketTypes.some((ticket) => ticket.name === type))

    if (!hasAllTypes) {
      throw new Error("Konser harus memiliki tiga kategori tiket: Regular, VIP, dan VVIP")
    }

    // BR-4: Check maximum 5 tickets per user per concert
    const userBookingCount = await this.bookingRepository.getUserBookingCount(request.userId, request.eventId)
    if (userBookingCount + request.quantity > 5) {
      throw new Error("Maksimal 5 tiket per konser per pengguna")
    }

    // BR-3: Check quota availability
    const ticketType = await this.ticketTypeRepository.findById(request.ticketTypeId)
    if (!ticketType) {
      throw new Error("Tipe tiket tidak ditemukan")
    }

    if (ticketType.sold + request.quantity > ticketType.quota) {
      throw new Error("Kuota tiket tidak mencukupi")
    }

    return true
  }
}
