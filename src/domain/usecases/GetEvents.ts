import type { EventRepository, EventFilters } from "../repositories/EventRepository"
import type { Event } from "../entities/Event"

export class GetEvents {
  constructor(private eventRepository: EventRepository) {}

  async execute(filters?: EventFilters): Promise<Event[]> {
    return await this.eventRepository.findAll(filters)
  }
}
