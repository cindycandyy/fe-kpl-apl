"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Minus, Plus, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingFormProps {
  event: any
  onBack: () => void
}

export function BookingForm({ event, onBack }: BookingFormProps) {
  const router = useRouter()
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0
      const newQuantity = Math.max(0, current + change)

      if (newQuantity === 0) {
        const { [ticketId]: removed, ...rest } = prev
        return rest
      }

      return { ...prev, [ticketId]: newQuantity }
    })
  }

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = event.ticketTypes.find((t: any) => t.id === ticketId)
      return total + (ticket?.price || 0) * quantity
    }, 0)
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate booking process
    const bookingData = {
      event: event,
      tickets: selectedTickets,
      customer: customerInfo,
      total: getTotalPrice(),
      bookingId: "BK" + Date.now(),
    }

    // In real app, send to API
    console.log("Booking data:", bookingData)

    // Redirect to success page or show success message
    router.push("/my-tickets")
  }

  const isFormValid = () => {
    return getTotalTickets() > 0 && customerInfo.name && customerInfo.email && customerInfo.phone
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Pilih Tiket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.ticketTypes.map((ticket: any) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{ticket.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Tersisa: {ticket.available}</Badge>
                        <span className="text-lg font-bold text-primary">
                          Rp {ticket.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketQuantity(ticket.id, -1)}
                        disabled={!selectedTickets[ticket.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateTicketQuantity(ticket.id, 1)}
                        disabled={ticket.available === 0 || (selectedTickets[ticket.id] || 0) >= ticket.available}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {selectedTickets[ticket.id] && (
                      <span className="font-medium">
                        Rp {(ticket.price * selectedTickets[ticket.id]).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pemesan</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Masukkan alamat email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Masukkan nomor telepon"
                    required
                  />
                </div>
              </form>
            </CardContent>
          </Card>
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
                  {new Date(event.date).toLocaleDateString("id-ID")} • {event.time} WIB
                </p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  const ticket = event.ticketTypes.find((t: any) => t.id === ticketId)
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

              {getTotalTickets() > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total ({getTotalTickets()} tiket)</span>
                    <span>Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>
                </>
              )}

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!isFormValid()}>
                <CreditCard className="w-4 h-4 mr-2" />
                Bayar Sekarang
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
