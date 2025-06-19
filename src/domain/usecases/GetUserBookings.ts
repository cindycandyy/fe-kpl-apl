import type { BookingRepository } from "../repositories/BookingRepository"
import type { EventRepository } from "../repositories/EventRepository"
import type { TicketTypeRepository } from "../repositories/TicketTypeRepository"
import type { Booking } from "../entities/Booking"

export interface BookingWithDetails extends Booking {
  eventTitle: string
  eventDate: Date
  eventLocation: string
  ticketTypeName: string
}

export class GetUserBookings {
  constructor(
    private bookingRepository: BookingRepository,
    private eventRepository: EventRepository,
    private ticketTypeRepository: TicketTypeRepository,
  ) {}

  async execute(userId: string): Promise<BookingWithDetails[]> {
    const bookings = await this.bookingRepository.findByUserId(userId)

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const event = await this.eventRepository.findById(booking.eventId)
        const ticketType = await this.ticketTypeRepository.findById(booking.ticketTypeId)

        return {
          ...booking,
          eventTitle: event?.title || "Unknown Event",
          eventDate: event?.date || new Date(),
          eventLocation: event?.location || "Unknown Location",
          ticketTypeName: ticketType?.name || "Unknown Ticket Type",
        }
      }),
    )

    return bookingsWithDetails.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}
