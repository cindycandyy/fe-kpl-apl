import type { BookTicket, BookTicketRequest } from "../../domain/usecases/BookTicket"
import type { GetUserBookings, BookingWithDetails } from "../../domain/usecases/GetUserBookings"
import type { Booking } from "../../domain/entities/Booking"

export class BookingService {
  constructor(
    private bookTicket: BookTicket,
    private getUserBookings: GetUserBookings,
  ) {}

  async bookTicket(request: BookTicketRequest): Promise<Booking> {
    return await this.bookTicket.execute(request)
  }

  async getUserBookings(userId: string): Promise<BookingWithDetails[]> {
    return await this.getUserBookings.execute(userId)
  }
}
