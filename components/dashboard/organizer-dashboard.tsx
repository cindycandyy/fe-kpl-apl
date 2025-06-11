"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Eye } from "lucide-react"
import Link from "next/link"

// Mock data
const stats = {
  totalEvents: 12,
  activeEvents: 8,
  totalTicketsSold: 1250,
  totalRevenue: 125000000,
  thisMonthRevenue: 25000000,
  revenueGrowth: 15.2,
}

const recentEvents = [
  {
    id: "1",
    title: "Konser Musik Jazz Malam",
    date: "2024-02-15",
    status: "active",
    ticketsSold: 320,
    capacity: 500,
    revenue: 48000000,
  },
  {
    id: "2",
    title: "Workshop Digital Marketing",
    date: "2024-02-20",
    status: "active",
    ticketsSold: 75,
    capacity: 100,
    revenue: 18750000,
  },
  {
    id: "3",
    title: "Seminar Teknologi AI",
    date: "2024-02-25",
    status: "draft",
    ticketsSold: 0,
    capacity: 200,
    revenue: 0,
  },
]

export function OrganizerDashboard() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Event</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">{stats.activeEvents} event aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTicketsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total semua event</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Semua waktu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(stats.thisMonthRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600">+{stats.revenueGrowth}% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Event Terbaru</CardTitle>
          <Button variant="outline" asChild>
            <Link href="/dashboard/events">Lihat Semua</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant={event.status === "active" ? "default" : "secondary"}>
                      {event.status === "active" ? "Aktif" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString("id-ID")}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>
                      <Users className="w-4 h-4 inline mr-1" />
                      {event.ticketsSold}/{event.capacity}
                    </span>
                    <span>
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Rp {(event.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/events/${event.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
