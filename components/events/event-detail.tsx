"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Clock, User } from "lucide-react"
import Image from "next/image"
import { BookingForm } from "./booking-form"

interface EventDetailProps {
  eventId: string
}

// Mock data - in real app, fetch based on eventId
const eventData = {
  id: "1",
  title: "Konser Musik Jazz Malam",
  description:
    "Nikmati malam yang penuh dengan alunan musik jazz dari musisi terbaik Indonesia. Event ini akan menampilkan berbagai musisi jazz ternama yang akan memukau Anda dengan permainan musik yang luar biasa.",
  longDescription: `
    Konser Musik Jazz Malam adalah event musik yang akan menghadirkan pengalaman tak terlupakan bagi para pecinta musik jazz. 
    
    Acara ini akan menampilkan:
    • Pertunjukan dari 5 band jazz terbaik Indonesia
    • Kolaborasi musik yang unik dan menarik
    • Suasana yang intimate dan cozy
    • Food & beverage tersedia di venue
    
    Jangan lewatkan kesempatan untuk menikmati malam yang penuh dengan harmoni musik jazz yang memukau!
  `,
  image: "/placeholder.svg?height=400&width=800",
  date: "2024-02-15",
  time: "19:00",
  endTime: "23:00",
  location: "Jakarta Convention Center",
  address: "Jl. Gatot Subroto, Jakarta Selatan",
  category: "Konser",
  capacity: 500,
  sold: 320,
  organizer: {
    name: "Jazz Indonesia",
    email: "info@jazzindonesia.com",
    phone: "+62 21 1234 5678",
  },
  ticketTypes: [
    {
      id: "1",
      name: "Regular",
      price: 150000,
      description: "Akses ke area regular dengan standing room",
      quota: 300,
      sold: 200,
      available: 100,
    },
    {
      id: "2",
      name: "VIP",
      price: 300000,
      description: "Akses ke area VIP dengan tempat duduk dan welcome drink",
      quota: 100,
      sold: 70,
      available: 30,
    },
    {
      id: "3",
      name: "VVIP",
      price: 500000,
      description: "Akses eksklusif dengan meet & greet artis dan merchandise",
      quota: 50,
      sold: 25,
      available: 25,
    },
  ],
}

export function EventDetail({ eventId }: EventDetailProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const event = eventData // In real app: fetch event by eventId

  if (showBookingForm) {
    return <BookingForm event={event} onBack={() => setShowBookingForm(false)} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="relative">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge className="mb-2" variant="secondary">
            {event.category}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg opacity-90">{event.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Tanggal</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Waktu</p>
                    <p className="text-sm text-muted-foreground">
                      {event.time} - {event.endTime} WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <p className="text-xs text-muted-foreground">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Kapasitas</p>
                    <p className="text-sm text-muted-foreground">
                      {event.sold}/{event.capacity} tiket terjual
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {event.longDescription.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Penyelenggara</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{event.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
                  <p className="text-sm text-muted-foreground">{event.organizer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Pesan Tiket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.ticketTypes.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{ticket.name}</h4>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    </div>
                    <p className="font-bold text-primary">Rp {ticket.price.toLocaleString("id-ID")}</p>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Tersisa: {ticket.available} tiket</span>
                    <Badge variant={ticket.available > 0 ? "default" : "destructive"}>
                      {ticket.available > 0 ? "Tersedia" : "Habis"}
                    </Badge>
                  </div>
                </div>
              ))}

              <Separator />

              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowBookingForm(true)}
                disabled={event.ticketTypes.every((t) => t.available === 0)}
              >
                {event.ticketTypes.every((t) => t.available === 0) ? "Tiket Habis" : "Pesan Sekarang"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Pembatalan dapat dilakukan hingga 24 jam sebelum event
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
