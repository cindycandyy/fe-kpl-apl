import type { DashboardRepository } from "../repositories/DashboardRepository"
import type { DashboardStats } from "../entities/DashboardStats"

export class GetDashboardStats {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(organizerId: string): Promise<DashboardStats> {
    if (!organizerId) {
      throw new Error("Organizer ID is required")
    }

    return await this.dashboardRepository.getStats(organizerId)
  }
}
