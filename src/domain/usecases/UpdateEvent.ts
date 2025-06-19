import type { EventRepository } from "../repositories/EventRepository"
import type { Event } from "../entities/Event"

export class UpdateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string, updates: Partial<Event>): Promise<Event> {
    const existingEvent = await this.eventRepository.findById(id)

    if (!existingEvent) {
      throw new Error("Event not found")
    }

    // Business rule: Cannot edit event if tickets are sold
    if (existingEvent.sold > 0 && this.hasSignificantChanges(updates)) {
      throw new Error("Cannot edit event details after tickets are sold")
    }

    return await this.eventRepository.update(id, updates)
  }

  private hasSignificantChanges(updates: Partial<Event>): boolean {
    const significantFields = ["title", "date", "time", "location", "capacity"]
    return significantFields.some((field) => field in updates)
  }
}
