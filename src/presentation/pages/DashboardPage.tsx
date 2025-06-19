"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useDashboard } from "../hooks/useDashboard"
import { DashboardStats } from "../components/dashboard/DashboardStats"
import { RecentEvents } from "../components/dashboard/RecentEvents"

export function DashboardPage() {
  const organizerId = "org1" // In real app, get from auth context
  const { stats, recentEvents, loading, error } = useDashboard(organizerId)

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!stats) {
    return <div>No data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Organizer</h1>
          <p className="text-muted-foreground">Kelola event dan pantau performa penjualan tiket</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/create">
            <Plus className="w-4 h-4 mr-2" />
            Buat Event Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Events */}
      <RecentEvents events={recentEvents} />
    </div>
  )
}
