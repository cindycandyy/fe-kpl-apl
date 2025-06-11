"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, DollarSign, Search, Plus, Edit, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data
const events = [
  {
    id: "1",
    title: "Konser Musik Jazz Malam",
    date: "2024-02-15",
    status: "active",
    ticketsSold: 320,
    capacity: 500,
    revenue: 48000000,
    category: "Konser",
    location: "Jakarta",
  },
  {
    id: "2",
    title: "Workshop Digital Marketing",
    date: "2024-02-20",
    status: "active",
    ticketsSold: 75,
    capacity: 100,
    revenue: 18750000,
    category: "Workshop",
    location: "Bandung",
  },
  {
    id: "3",
    title: "Seminar Teknologi AI",
    date: "2024-02-25",
    status: "draft",
    ticketsSold: 0,
    capacity: 200,
    revenue: 0,
    category: "Seminar",
    location: "Surabaya",
  },
  {
    id: "4",
    title: "Festival Kuliner Nusantara",
    date: "2024-03-01",
    status: "active",
    ticketsSold: 600,
    capacity: 1000,
    revenue: 30000000,
    category: "Festival",
    location: "Yogyakarta",
  },
]

export function EventManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kelola Event</h1>
          <p className="text-muted-foreground">Kelola semua event yang Anda selenggarakan</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/create">
            <Plus className="w-4 h-4 mr-2" />
            Buat Event Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="konser">Konser</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge
                      variant={
                        event.status === "active" ? "default" : event.status === "draft" ? "secondary" : "outline"
                      }
                    >
                      {event.status === "active" ? "Aktif" : event.status === "draft" ? "Draft" : "Selesai"}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString("id-ID")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.ticketsSold}/{event.capacity} tiket
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>Rp {(event.revenue / 1000000).toFixed(1)}M</span>
                    </div>

                    <div className="text-sm text-muted-foreground">{event.location}</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Penjualan Tiket</span>
                      <span>{Math.round((event.ticketsSold / event.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/events/${event.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Hapus Event</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Tidak ada event yang ditemukan</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
