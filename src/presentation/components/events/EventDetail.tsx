"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react"
import Image from "next/image"
import { BookingForm } from "./BookingForm"
import { useEvents } from "../../hooks/useEvents"
import { useAuth } from "../../contexts/AuthContext"
import type { Event } from "../../../domain/entities/Event"
import type { TicketType } from "../../../domain/entities/TicketType"

interface EventDetailProps {
  eventId: string
}

export function EventDetail({ eventId }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const { getEventById, getEventTicketTypes } = useEvents()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        const [eventData, ticketTypesData] = await Promise.all([getEventById(eventId), getEventTicketTypes(eventId)])

        setEvent(eventData)
        setTicketTypes(ticketTypesData)
      } catch (error) {
        console.error("Failed to fetch event data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, getEventById, getEventTicketTypes])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!event) {
    return <div className="text-center py-12">Event tidak ditemukan</div>
  }

  if (showBookingForm) {
    return <BookingForm event={event} ticketTypes={ticketTypes} onBack={() => setShowBookingForm(false)} />
  }

  const availableTickets = event.capacity - event.sold
  const isAlmostSoldOut = availableTickets <= event.capacity * 0.1

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
          <div className="flex gap-2 mb-2">
            <Badge variant="secondary">{event.category}</Badge>
            {isAlmostSoldOut && (
              <Badge variant="destructive">
                <Star className="w-3 h-3 mr-1" />
                Hampir Habis
              </Badge>
            )}
          </div>
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
                      {event.date.toLocaleDateString("id-ID", {
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
                      {event.time} {event.endTime && `- ${event.endTime}`} WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    {event.address && <p className="text-xs text-muted-foreground">{event.address}</p>}
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
          {event.longDescription && (
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
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Pesan Tiket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketTypes.map((ticket) => {
                const available = ticket.quota - ticket.sold
                return (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{ticket.name}</h4>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        {ticket.features && ticket.features.length > 0 && (
                          <ul className="text-xs text-muted-foreground mt-1">
                            {ticket.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <p className="font-bold text-primary">Rp {ticket.price.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tersisa: {available} tiket</span>
                      <Badge variant={available > 0 ? "default" : "destructive"}>
                        {available > 0 ? "Tersedia" : "Habis"}
                      </Badge>
                    </div>
                  </div>
                )
              })}

              <Separator />

              {!isAuthenticated ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Silakan login untuk memesan tiket</p>
                  <Button asChild className="w-full">
                    <a href="/login">Login</a>
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowBookingForm(true)}
                  disabled={availableTickets === 0}
                >
                  {availableTickets === 0 ? "Tiket Habis" : "Pesan Sekarang"}
                </Button>
              )}

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
