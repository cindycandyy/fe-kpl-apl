import type { TicketTypeRepository } from "../../domain/repositories/TicketTypeRepository"
import { type TicketType, TicketTypeName } from "../../domain/entities/TicketType"

export class InMemoryTicketTypeRepository implements TicketTypeRepository {
  private ticketTypes: TicketType[] = [
    // Concert tickets (BR-2: Must have Regular, VIP, VVIP)
    {
      id: "1",
      eventId: "1",
      name: TicketTypeName.REGULAR,
      price: 150000,
      quota: 300,
      sold: 200,
      description: "Akses ke area regular dengan standing room",
      features: ["Standing area", "Akses toilet", "Merchandise booth"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      eventId: "1",
      name: TicketTypeName.VIP,
      price: 300000,
      quota: 150,
      sold: 100,
      description: "Akses ke area VIP dengan tempat duduk dan welcome drink",
      features: ["Reserved seating", "Welcome drink", "VIP toilet", "Meet & greet"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      eventId: "1",
      name: TicketTypeName.VVIP,
      price: 500000,
      quota: 50,
      sold: 20,
      description: "Akses eksklusif dengan meet & greet artis dan merchandise",
      features: ["Premium seating", "Backstage access", "Artist meet & greet", "Exclusive merchandise", "Catering"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Workshop tickets
    {
      id: "4",
      eventId: "2",
      name: TicketTypeName.REGULAR,
      price: 250000,
      quota: 100,
      sold: 75,
      description: "Akses workshop dengan materi lengkap",
      features: ["Workshop materials", "Certificate", "Lunch"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Seminar tickets
    {
      id: "5",
      eventId: "3",
      name: TicketTypeName.REGULAR,
      price: 100000,
      quota: 50,
      sold: 25,
      description: "Akses seminar dengan pemilihan tempat duduk",
      features: ["Seat selection", "Seminar materials", "Coffee break"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Exhibition tickets (BR-5: Regular and VIP access)
    {
      id: "6",
      eventId: "4",
      name: TicketTypeName.REGULAR,
      price: 50000,
      quota: 150,
      sold: 30,
      description: "Akses reguler ke pameran",
      features: ["Exhibition access", "Audio guide"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "7",
      eventId: "4",
      name: TicketTypeName.VIP,
      price: 100000,
      quota: 50,
      sold: 20,
      description: "Akses VIP dengan jadwal kunjungan khusus",
      features: ["Priority access", "Guided tour", "Artist talk", "Exclusive catalog"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  async findByEventId(eventId: string): Promise<TicketType[]> {
    return this.ticketTypes.filter((ticket) => ticket.eventId === eventId)
  }

  async findById(id: string): Promise<TicketType | null> {
    return this.ticketTypes.find((ticket) => ticket.id === id) || null
  }

  async create(ticketTypeData: Omit<TicketType, "id" | "createdAt" | "updatedAt">): Promise<TicketType> {
    const ticketType: TicketType = {
      ...ticketTypeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.ticketTypes.push(ticketType)
    return ticketType
  }

  async update(id: string, updates: Partial<TicketType>): Promise<TicketType> {
    const index = this.ticketTypes.findIndex((ticket) => ticket.id === id)

    if (index === -1) {
      throw new Error("Ticket type not found")
    }

    this.ticketTypes[index] = {
      ...this.ticketTypes[index],
      ...updates,
      updatedAt: new Date(),
    }

    return this.ticketTypes[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.ticketTypes.findIndex((ticket) => ticket.id === id)

    if (index === -1) {
      throw new Error("Ticket type not found")
    }

    this.ticketTypes.splice(index, 1)
  }

  async bulkCreate(ticketTypesData: Omit<TicketType, "id" | "createdAt" | "updatedAt">[]): Promise<TicketType[]> {
    const ticketTypes = ticketTypesData.map((data) => ({
      ...data,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    this.ticketTypes.push(...ticketTypes)
    return ticketTypes
  }
}
