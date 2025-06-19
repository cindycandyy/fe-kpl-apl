import type { GetAvailableEvents } from "../../domain/usecases/GetAvailableEvents"
import type { EventRepository, EventFilters } from "../../domain/repositories/EventRepository"
import type { TicketTypeRepository } from "../../domain/repositories/TicketTypeRepository"
import type { Event } from "../../domain/entities/Event"
import type { TicketType } from "../../domain/entities/TicketType"

export class EventService {
  constructor(
    private getAvailableEventsUseCase: GetAvailableEvents,
    private eventRepository: EventRepository,
    private ticketTypeRepository: TicketTypeRepository,
  ) {}

  async getAvailableEvents(filters?: EventFilters): Promise<Event[]> {
    return await this.getAvailableEventsUseCase.execute(filters)
  }

  async getEventById(id: string): Promise<Event | null> {
    return await this.eventRepository.findById(id)
  }

  async getEventTicketTypes(eventId: string): Promise<TicketType[]> {
    return await this.ticketTypeRepository.findByEventId(eventId)
  }
}
