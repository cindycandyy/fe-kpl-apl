import type { TicketTypeName } from "./TicketType" // Assuming TicketTypeName is declared in TicketType.ts

export interface Seat {
  id: string
  eventId: string
  seatNumber: string
  row: string
  section: string
  isBooked: boolean
  bookedBy?: string
  ticketType: TicketTypeName
  createdAt: Date
  updatedAt: Date
}
