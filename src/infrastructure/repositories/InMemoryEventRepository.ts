import type { EventRepository, EventFilters } from "../../domain/repositories/EventRepository"
import { type Event, EventStatus, EventCategory, EventType } from "../../domain/entities/Event"

export class InMemoryEventRepository implements EventRepository {
  private events: Event[] = [
    {
      id: "1",
      title: "Konser Musik Jazz Malam",
      description: "Nikmati malam yang penuh dengan alunan musik jazz dari musisi terbaik Indonesia",
      longDescription: "Konser Musik Jazz Malam adalah event musik yang akan menghadirkan pengalaman tak terlupakan...",
      category: EventCategory.KONSER,
      type: EventType.CONCERT,
      date: new Date("2024-02-15"),
      time: "19:00",
      endTime: "23:00",
      location: "Jakarta Convention Center",
      address: "Jl. Gatot Subroto, Jakarta Selatan",
      capacity: 500,
      sold: 320,
      status: EventStatus.ACTIVE,
      organizerId: "org1",
      image: "/placeholder.svg?height=200&width=400",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      title: "Workshop Digital Marketing",
      description: "Pelajari strategi digital marketing terkini untuk mengembangkan bisnis Anda",
      category: EventCategory.WORKSHOP,
      type: EventType.WORKSHOP,
      date: new Date("2024-02-20"),
      time: "09:00",
      endTime: "17:00",
      location: "Bandung Creative Hub",
      capacity: 100,
      sold: 75,
      status: EventStatus.ACTIVE,
      organizerId: "org1",
      image: "/placeholder.svg?height=200&width=400",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "3",
      title: "Seminar Teknologi AI",
      description: "Diskusi mendalam tentang perkembangan AI dan dampaknya terhadap industri",
      category: EventCategory.SEMINAR,
      type: EventType.SEMINAR,
      date: new Date("2024-02-25"),
      time: "13:00",
      location: "Surabaya Tech Center",
      capacity: 50,
      sold: 25,
      status: EventStatus.ACTIVE,
      organizerId: "org1",
      image: "/placeholder.svg?height=200&width=400",
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
    },
    {
      id: "4",
      title: "Pameran Seni Modern",
      description: "Pameran karya seni modern dari seniman lokal dan internasional",
      category: EventCategory.EXHIBITION,
      type: EventType.EXHIBITION,
      date: new Date("2024-03-01"),
      time: "10:00",
      endTime: "18:00",
      location: "Galeri Nasional",
      capacity: 200,
      sold: 50,
      status: EventStatus.ACTIVE,
      organizerId: "org1",
      image: "/placeholder.svg?height=200&width=400",
      createdAt: new Date("2024-01-04"),
      updatedAt: new Date("2024-01-04"),
    },
  ]

  async findAll(filters?: EventFilters): Promise<Event[]> {
    let filteredEvents = [...this.events]

    if (filters?.status) {
      filteredEvents = filteredEvents.filter((event) => event.status === filters.status)
    }

    if (filters?.category) {
      filteredEvents = filteredEvents.filter((event) => event.category === filters.category)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower),
      )
    }

    return filteredEvents
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find((event) => event.id === id) || null
  }

  async create(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const event: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.events.push(event)
    return event
  }

  async update(id: string, updates: Partial<Event>): Promise<Event> {
    const index = this.events.findIndex((event) => event.id === id)

    if (index === -1) {
      throw new Error("Event not found")
    }

    this.events[index] = {
      ...this.events[index],
      ...updates,
      updatedAt: new Date(),
    }

    return this.events[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex((event) => event.id === id)

    if (index === -1) {
      throw new Error("Event not found")
    }

    this.events.splice(index, 1)
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.events.filter((event) => event.organizerId === organizerId)
  }
}
