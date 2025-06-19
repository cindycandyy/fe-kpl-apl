import type { EventRepository, EventFilters } from "../repositories/EventRepository"
import type { Event } from "../entities/Event"
import { EventStatus } from "../entities/Event"

export class GetAvailableEvents {
  constructor(private eventRepository: EventRepository) {}

  async execute(filters?: EventFilters): Promise<Event[]> {
    // Only show active events to users (US-3: See all available events)
    const eventFilters: EventFilters = {
      ...filters,
      status: EventStatus.ACTIVE,
    }

    const events = await this.eventRepository.findAll(eventFilters)

    // Filter out events that are fully booked
    return events.filter((event) => event.sold < event.capacity)
  }
}
