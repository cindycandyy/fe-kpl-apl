import type { GetDashboardStats } from "../../domain/usecases/GetDashboardStats"
import type { GetEvents } from "../../domain/usecases/GetEvents"
import type { CreateEvent } from "../../domain/usecases/CreateEvent"
import type { UpdateEvent } from "../../domain/usecases/UpdateEvent"
import type { DashboardRepository } from "../../domain/repositories/DashboardRepository"
import type { EventFilters } from "../../domain/repositories/EventRepository"

export class DashboardService {
  constructor(
    private getDashboardStats: GetDashboardStats,
    private getEvents: GetEvents,
    private createEvent: CreateEvent,
    private updateEvent: UpdateEvent,
    private dashboardRepository: DashboardRepository,
  ) {}

  async getDashboardStats(organizerId: string) {
    return await this.getDashboardStats.execute(organizerId)
  }

  async getEvents(filters?: EventFilters) {
    return await this.getEvents.execute(filters)
  }

  async getRecentEvents(organizerId: string, limit?: number) {
    return await this.dashboardRepository.getRecentEvents(organizerId, limit)
  }

  async createEvent(request: any) {
    return await this.createEvent.execute(request)
  }

  async updateEvent(id: string, updates: any) {
    return await this.updateEvent.execute(id, updates)
  }
}
