import type { Event, EventStatus, EventCategory } from "../entities/Event"

export interface EventFilters {
  status?: EventStatus
  category?: EventCategory
  search?: string
  organizerId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface EventRepository {
  findAll(filters?: EventFilters): Promise<Event[]>
  findById(id: string): Promise<Event | null>
  create(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event>
  update(id: string, event: Partial<Event>): Promise<Event>
  delete(id: string): Promise<void>
  findByOrganizer(organizerId: string): Promise<Event[]>
}
