import type { TicketType } from "../entities/TicketType"

export interface TicketTypeRepository {
  findByEventId(eventId: string): Promise<TicketType[]>
  create(ticketType: Omit<TicketType, "id" | "createdAt" | "updatedAt">): Promise<TicketType>
  update(id: string, ticketType: Partial<TicketType>): Promise<TicketType>
  delete(id: string): Promise<void>
  bulkCreate(ticketTypes: Omit<TicketType, "id" | "createdAt" | "updatedAt">[]): Promise<TicketType[]>
}
