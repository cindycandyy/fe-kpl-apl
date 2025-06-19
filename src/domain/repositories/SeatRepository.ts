import type { Seat } from "../entities/Seat"
import type { TicketTypeName } from "../entities/TicketType"

export interface SeatRepository {
  findByEventId(eventId: string): Promise<Seat[]>
  findAvailableSeats(eventId: string, ticketType: TicketTypeName): Promise<Seat[]>
  reserveSeats(seatIds: string[], userId: string): Promise<void>
  releaseSeats(seatIds: string[]): Promise<void>
}
