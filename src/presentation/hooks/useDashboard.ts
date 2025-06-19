"use client"

import { useState, useEffect } from "react"
import { Container } from "../../infrastructure/di/Container"
import type { DashboardService } from "../../application/services/DashboardService"
import type { DashboardStats } from "../../domain/entities/DashboardStats"
import type { Event } from "../../domain/entities/Event"

export function useDashboard(organizerId: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dashboardService = Container.getInstance().get<DashboardService>("dashboardService")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsData, eventsData] = await Promise.all([
          dashboardService.getDashboardStats(organizerId),
          dashboardService.getRecentEvents(organizerId, 3),
        ])

        setStats(statsData)
        setRecentEvents(eventsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (organizerId) {
      fetchDashboardData()
    }
  }, [organizerId, dashboardService])

  return {
    stats,
    recentEvents,
    loading,
    error,
    refetch: () => {
      if (organizerId) {
        // Re-fetch data
      }
    },
  }
}
