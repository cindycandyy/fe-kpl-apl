import type { DashboardStats } from "../entities/DashboardStats"

export interface DashboardRepository {
  getStats(organizerId: string): Promise<DashboardStats>
  getRecentEvents(organizerId: string, limit?: number): Promise<Event[]>
}
