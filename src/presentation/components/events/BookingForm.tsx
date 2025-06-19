"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { useBooking } from "../../hooks/useBooking"
import { SeminarSeatSelector } from "./SeminarSeatSelector"
import { ConcertTicketSelector } from "./ConcertTicketSelector"
import type { Event } from "../../../domain/entities/Event"
import type { TicketType } from "../../../domain/entities/TicketType"
import { EventType } from "../../../domain/entities/Event"

interface BookingFormProps {
  event: Event
  ticketTypes: TicketType[]
  onBack: () => void
}

export function BookingForm({ event, ticketTypes, onBack }: BookingFormProps) {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [visitSchedule, setVisitSchedule] = useState<string>("")

  const { user, isVIP } = useAuth()
  const { bookTicket, loading, error } = useBooking()
  const router = useRouter()

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId)
      return total + (ticket?.price || 0) * quantity
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0)
  }

  const handleTicketChange = (ticketId: string, quantity: number) => {
    if (quantity === 0) {
      const { [ticketId]: removed, ...rest } = selectedTickets
      setSelectedTickets(rest)
    } else {
      setSelectedTickets((prev) => ({ ...prev, [ticketId]: quantity }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Silakan login terlebih dahulu")
      return
    }

    try {
      // For seminars, validate seat selection (US-1)
      if (event.type === EventType.SEMINAR && selectedSeats.length !== getTotalTickets()) {
        alert("Silakan pilih kursi sesuai jumlah tiket")
        return
      }

      // Book each ticket type separately
      for (const [ticketTypeId, quantity] of Object.entries(selectedTickets)) {
        if (quantity > 0) {
          await bookTicket({
            userId: user.id,
            eventId: event.id,
            ticketTypeId,
            quantity,
            seatNumbers: event.type === EventType.SEMINAR ? selectedSeats : undefined,
            visitSchedule: isVIP && visitSchedule ? new Date(visitSchedule) : undefined,
          })
        }
      }

      alert("Tiket berhasil dipesan!")
      router.push("/my-tickets")
    } catch (err) {
      console.error("Booking failed:", err)
    }
  }

  const isFormValid = () => {
    const hasTickets = getTotalTickets() > 0
    const hasSeatSelection = event.type !== EventType.SEMINAR || selectedSeats.length === getTotalTickets()
    return hasTickets && hasSeatSelection
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Pesan Tiket</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Concert Ticket Selection (US-2) */}
          {event.type === EventType.CONCERT && (
            <ConcertTicketSelector
              ticketTypes={ticketTypes}
              selectedTickets={selectedTickets}
              onTicketChange={handleTicketChange}
              maxTicketsPerUser={5} // BR-4
              userCurrentBookings={0} // This should come from user's existing bookings
            />
          )}

          {/* Seminar Ticket Selection */}
          {event.type === EventType.SEMINAR && (
            <>
              {/* Simple ticket selection for seminars */}
              <Card>
                <CardHeader>
                  <CardTitle>Pilih Tiket Seminar</CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketTypes.map((ticket) => {
                    const available = ticket.quota - ticket.sold
                    const selected = selectedTickets[ticket.id] || 0

                    return (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{ticket.name}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            <span className="text-lg font-bold text-primary">
                              Rp {ticket.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <Button
                            variant={selected > 0 ? "default" : "outline"}
                            onClick={() => handleTicketChange(ticket.id, selected > 0 ? 0 : 1)}
                            disabled={available === 0}
                          >
                            {selected > 0 ? "Dipilih" : available === 0 ? "Habis" : "Pilih"}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Seat Selection for Seminars (US-1) */}
              {getTotalTickets() > 0 && (
                <SeminarSeatSelector
                  eventId={event.id}
                  userId={user?.id || ""}
                  requiredSeats={getTotalTickets()}
                  onSeatsSelected={setSelectedSeats}
                  selectedSeats={selectedSeats}
                />
              )}
            </>
          )}

          {/* Exhibition Ticket Selection */}
          {event.type === EventType.EXHIBITION && (
            <Card>
              <CardHeader>
                <CardTitle>Pilih Tiket Pameran</CardTitle>
                <p className="text-sm text-muted-foreground">Pameran memiliki akses Regular dan VIP (BR-5)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypes.map((ticket) => {
                  const available = ticket.quota - ticket.sold
                  const selected = selectedTickets[ticket.id] || 0

                  return (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{ticket.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>

                          {ticket.features && (
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {ticket.features.map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          )}

                          <span className="text-lg font-bold text-primary">
                            Rp {ticket.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant={selected > 0 ? "default" : "outline"}
                        onClick={() => handleTicketChange(ticket.id, selected > 0 ? 0 : 1)}
                        disabled={available === 0}
                        className="w-full"
                      >
                        {selected > 0 ? "Dipilih" : available === 0 ? "Habis" : "Pilih"}
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* VIP Schedule Selection for Exhibitions */}
          {isVIP && event.type === EventType.EXHIBITION && getTotalTickets() > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Kunjungan VIP</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm font-medium mb-2">Pilih Waktu Kunjungan</label>
                <input
                  type="datetime-local"
                  value={visitSchedule}
                  onChange={(e) => setVisitSchedule(e.target.value)}
                  min={event.date.toISOString().slice(0, 16)}
                  className="w-full p-2 border rounded"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sebagai member VIP, Anda dapat memilih jadwal kunjungan khusus
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.date.toLocaleDateString("id-ID")} • {event.time} WIB
                </p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  const ticket = ticketTypes.find((t) => t.id === ticketId)
                  if (!ticket || quantity === 0) return null

                  return (
                    <div key={ticketId} className="flex justify-between text-sm">
                      <span>
                        {ticket.name} x{quantity}
                      </span>
                      <span>Rp {(ticket.price * quantity).toLocaleString("id-ID")}</span>
                    </div>
                  )
                })}
              </div>

              {/* Seat information for seminars */}
              {event.type === EventType.SEMINAR && selectedSeats.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium">Kursi yang dipilih:</p>
                    <p className="text-sm text-muted-foreground">{selectedSeats.join(", ")}</p>
                  </div>
                </>
              )}

              {getTotalTickets() > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total ({getTotalTickets()} tiket)</span>
                    <span>Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </>
              )}

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!isFormValid() || loading}>
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
