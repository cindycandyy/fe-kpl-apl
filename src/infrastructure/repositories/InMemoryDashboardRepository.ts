import type { DashboardRepository } from "../../domain/repositories/DashboardRepository"
import type { DashboardStats } from "../../domain/entities/DashboardStats"
import type { Event } from "../../domain/entities/Event"
import type { EventRepository } from "../../domain/repositories/EventRepository"

export class InMemoryDashboardRepository implements DashboardRepository {
  constructor(private eventRepository: EventRepository) {}

  async getStats(organizerId: string): Promise<DashboardStats> {
    const events = await this.eventRepository.findByOrganizer(organizerId)

    const totalEvents = events.length
    const activeEvents = events.filter((event) => event.status === "active").length
    const totalTicketsSold = events.reduce((sum, event) => sum + event.sold, 0)

    // Mock revenue calculation (in real app, this would come from ticket sales)
    const totalRevenue = events.reduce((sum, event) => sum + event.sold * 150000, 0)
    const thisMonthRevenue = totalRevenue * 0.2 // Mock 20% of total
    const revenueGrowth = 15.2 // Mock growth percentage

    return {
      totalEvents,
      activeEvents,
      totalTicketsSold,
      totalRevenue,
      thisMonthRevenue,
      revenueGrowth,
    }
  }

  async getRecentEvents(organizerId: string, limit = 5): Promise<Event[]> {
    const events = await this.eventRepository.findByOrganizer(organizerId)

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }
}
