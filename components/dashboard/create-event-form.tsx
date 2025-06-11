"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface TicketType {
  id: string
  name: string
  price: number
  quota: number
  description: string
}

export function CreateEventForm() {
  const router = useRouter()
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    address: "",
    capacity: 0,
    image: "",
  })

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: "1",
      name: "Regular",
      price: 0,
      quota: 0,
      description: "",
    },
  ])

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quota: 0,
      description: "",
    }
    setTicketTypes([...ticketTypes, newTicket])
  }

  const removeTicketType = (id: string) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== id))
    }
  }

  const updateTicketType = (id: string, field: keyof TicketType, value: string | number) => {
    setTicketTypes(ticketTypes.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
  }

  const getTotalQuota = () => {
    return ticketTypes.reduce((total, ticket) => total + ticket.quota, 0)
  }

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()

    const formData = {
      ...eventData,
      ticketTypes,
      status: isDraft ? "draft" : "active",
      createdAt: new Date().toISOString(),
    }

    // In real app, send to API
    console.log("Event data:", formData)

    // Redirect to event management
    router.push("/dashboard/events")
  }

  const isFormValid = () => {
    return (
      eventData.title &&
      eventData.description &&
      eventData.category &&
      eventData.date &&
      eventData.time &&
      eventData.location &&
      eventData.capacity > 0 &&
      ticketTypes.every((ticket) => ticket.name && ticket.price >= 0 && ticket.quota > 0) &&
      getTotalQuota() <= eventData.capacity
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Event *</Label>
            <Input
              id="title"
              value={eventData.title}
              onChange={(e) => setEventData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul event"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi Singkat *</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat tentang event"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Deskripsi Lengkap</Label>
            <Textarea
              id="longDescription"
              value={eventData.longDescription}
              onChange={(e) => setEventData((prev) => ({ ...prev, longDescription: e.target.value }))}
              placeholder="Deskripsi detail tentang event, agenda, dll."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={eventData.category}
                onValueChange={(value) => setEventData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="konser">Konser</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="olahraga">Olahraga</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="capacity">Kapasitas Maksimal *</Label>
              <Input
                id="capacity"
                type="number"
                value={eventData.capacity || ""}
                onChange={(e) => setEventData((prev) => ({ ...prev, capacity: Number.parseInt(e.target.value) || 0 }))}
                placeholder="Jumlah maksimal peserta"
                min="1"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle>Tanggal & Waktu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Tanggal Event *</Label>
              <Input
                id="date"
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Waktu Mulai *</Label>
              <Input
                id="time"
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">Waktu Selesai</Label>
              <Input
                id="endTime"
                type="time"
                value={eventData.endTime}
                onChange={(e) => setEventData((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Lokasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="location">Nama Venue *</Label>
            <Input
              id="location"
              value={eventData.location}
              onChange={(e) => setEventData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Contoh: Jakarta Convention Center"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              value={eventData.address}
              onChange={(e) => setEventData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Alamat lengkap venue"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ticket Types */}
      <Card>
        <CardHeader>
          <CardTitle>Kategori Tiket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticketTypes.map((ticket, index) => (
            <div key={ticket.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Tiket {index + 1}</h4>
                {ticketTypes.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeTicketType(ticket.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Tiket *</Label>
                  <Input
                    value={ticket.name}
                    onChange={(e) => updateTicketType(ticket.id, "name", e.target.value)}
                    placeholder="Contoh: Regular, VIP, VVIP"
                    required
                  />
                </div>

                <div>
                  <Label>Harga (Rp) *</Label>
                  <Input
                    type="number"
                    value={ticket.price || ""}
                    onChange={(e) => updateTicketType(ticket.id, "price", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label>Kuota *</Label>
                  <Input
                    type="number"
                    value={ticket.quota || ""}
                    onChange={(e) => updateTicketType(ticket.id, "quota", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label>Deskripsi</Label>
                  <Input
                    value={ticket.description}
                    onChange={(e) => updateTicketType(ticket.id, "description", e.target.value)}
                    placeholder="Deskripsi singkat tiket"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addTicketType} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori Tiket
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Total Kuota Tiket:</span>
              <span className={getTotalQuota() > eventData.capacity ? "text-destructive" : ""}>
                {getTotalQuota()} / {eventData.capacity}
              </span>
            </div>
            {getTotalQuota() > eventData.capacity && (
              <p className="text-sm text-destructive mt-1">Total kuota tiket tidak boleh melebihi kapasitas venue</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)}>
          <Save className="w-4 h-4 mr-2" />
          Simpan sebagai Draft
        </Button>

        <Button type="submit" disabled={!isFormValid()}>
          <Eye className="w-4 h-4 mr-2" />
          Publikasikan Event
        </Button>
      </div>
    </form>
  )
}
