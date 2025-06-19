"use client"

import { useState, useEffect } from "react"
import { Container } from "../../infrastructure/di/Container"
import type { EventService } from "../../application/services/EventService"
import type { Event } from "../../domain/entities/Event"
import type { TicketType } from "../../domain/entities/TicketType"
import type { EventFilters } from "../../domain/repositories/EventRepository"

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<EventFilters>({})

  const eventService = Container.getInstance().get<EventService>("eventService")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching events with service:", eventService)
        console.log("Service methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(eventService)))

        const eventsData = await eventService.getAvailableEvents(filters)
        setEvents(eventsData)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [filters, eventService])

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const getEventById = async (id: string): Promise<Event | null> => {
    try {
      return await eventService.getEventById(id)
    } catch (err) {
      console.error("Error fetching event by ID:", err)
      return null
    }
  }

  const getEventTicketTypes = async (eventId: string): Promise<TicketType[]> => {
    try {
      return await eventService.getEventTicketTypes(eventId)
    } catch (err) {
      console.error("Error fetching ticket types:", err)
      return []
    }
  }

  return {
    events,
    loading,
    error,
    filters,
    updateFilters,
    getEventById,
    getEventTicketTypes,
  }
}
