import type { EventRepository } from "../repositories/EventRepository"
import type { TicketTypeRepository } from "../repositories/TicketTypeRepository"
import type { Event } from "../entities/Event"
import type { TicketType } from "../entities/TicketType"

export interface CreateEventRequest {
  event: Omit<Event, "id" | "createdAt" | "updatedAt" | "sold">
  ticketTypes: Omit<TicketType, "id" | "eventId" | "createdAt" | "updatedAt" | "sold">[]
}

export class CreateEvent {
  constructor(
    private eventRepository: EventRepository,
    private ticketTypeRepository: TicketTypeRepository,
  ) {}

  async execute(request: CreateEventRequest): Promise<Event> {
    // Business rules validation
    this.validateEventData(request.event)
    this.validateTicketTypes(request.ticketTypes, request.event.capacity)

    // Create event
    const createdEvent = await this.eventRepository.create({
      ...request.event,
      sold: 0,
    })

    // Create ticket types
    const ticketTypesWithEventId = request.ticketTypes.map((ticketType) => ({
      ...ticketType,
      eventId: createdEvent.id,
      sold: 0,
    }))

    await this.ticketTypeRepository.bulkCreate(ticketTypesWithEventId)

    return createdEvent
  }

  private validateEventData(event: Omit<Event, "id" | "createdAt" | "updatedAt" | "sold">): void {
    if (!event.title?.trim()) {
      throw new Error("Event title is required")
    }

    if (!event.description?.trim()) {
      throw new Error("Event description is required")
    }

    if (event.capacity <= 0) {
      throw new Error("Event capacity must be greater than 0")
    }

    if (new Date(event.date) <= new Date()) {
      throw new Error("Event date must be in the future")
    }
  }

  private validateTicketTypes(
    ticketTypes: Omit<TicketType, "id" | "eventId" | "createdAt" | "updatedAt" | "sold">[],
    eventCapacity: number,
  ): void {
    if (ticketTypes.length === 0) {
      throw new Error("At least one ticket type is required")
    }

    const totalQuota = ticketTypes.reduce((sum, ticket) => sum + ticket.quota, 0)

    if (totalQuota > eventCapacity) {
      throw new Error("Total ticket quota cannot exceed event capacity")
    }

    for (const ticketType of ticketTypes) {
      if (!ticketType.name?.trim()) {
        throw new Error("Ticket type name is required")
      }

      if (ticketType.price < 0) {
        throw new Error("Ticket price cannot be negative")
      }

      if (ticketType.quota <= 0) {
        throw new Error("Ticket quota must be greater than 0")
      }
    }
  }
}
