"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, QrCode, Download, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data
const tickets = [
  {
    id: "TK001",
    eventId: "1",
    eventTitle: "Konser Musik Jazz Malam",
    eventDate: "2024-02-15",
    eventTime: "19:00",
    location: "Jakarta Convention Center",
    ticketType: "VIP",
    quantity: 2,
    totalPrice: 600000,
    status: "active",
    purchaseDate: "2024-01-15",
    qrCode: "QR123456789",
  },
  {
    id: "TK002",
    eventId: "2",
    eventTitle: "Workshop Digital Marketing",
    eventDate: "2024-02-20",
    eventTime: "09:00",
    location: "Bandung Creative Hub",
    ticketType: "Regular",
    quantity: 1,
    totalPrice: 250000,
    status: "active",
    purchaseDate: "2024-01-20",
    qrCode: "QR987654321",
  },
  {
    id: "TK003",
    eventId: "3",
    eventTitle: "Seminar Teknologi AI",
    eventDate: "2024-01-10",
    eventTime: "13:00",
    location: "Surabaya Tech Center",
    ticketType: "Regular",
    quantity: 1,
    totalPrice: 100000,
    status: "used",
    purchaseDate: "2024-01-05",
    qrCode: "QR456789123",
  },
]

export function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const activeTickets = tickets.filter((ticket) => ticket.status === "active")
  const pastTickets = tickets.filter((ticket) => ticket.status === "used")

  const canCancelTicket = (ticket: any) => {
    const eventDate = new Date(ticket.eventDate)
    const now = new Date()
    const timeDiff = eventDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    return hoursDiff > 24 && ticket.status === "active"
  }

  const handleCancelTicket = (ticketId: string) => {
    // In real app, send cancel request to API
    console.log("Cancelling ticket:", ticketId)
  }

  const TicketCard = ({ ticket }: { ticket: any }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{ticket.eventTitle}</h3>
              <p className="opacity-90">
                {ticket.ticketType} • {ticket.quantity} tiket
              </p>
            </div>
            <Badge variant={ticket.status === "active" ? "secondary" : "outline"}>
              {ticket.status === "active" ? "Aktif" : "Terpakai"}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(ticket.eventDate).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{ticket.eventTime} WIB</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{ticket.location}</span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                <p className="font-semibold">Rp {ticket.totalPrice.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>QR Code Tiket</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                      <div className="w-48 h-48 bg-muted mx-auto flex items-center justify-center">
                        <QrCode className="w-24 h-24" />
                      </div>
                      <div>
                        <p className="font-medium">{ticket.eventTitle}</p>
                        <p className="text-sm text-muted-foreground">ID: {ticket.id}</p>
                      </div>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {canCancelTicket(ticket) && (
                  <Button variant="outline" size="sm" onClick={() => handleCancelTicket(ticket.id)}>
                    <X className="w-4 h-4 mr-2" />
                    Batalkan
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tiket Saya</h1>
        <p className="text-muted-foreground">Kelola dan lihat semua tiket yang telah Anda beli</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Tiket Aktif ({activeTickets.length})</TabsTrigger>
          <TabsTrigger value="past">Riwayat ({pastTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTickets.length > 0 ? (
            <div className="grid gap-4">
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Anda belum memiliki tiket aktif</p>
                <Button className="mt-4" asChild>
                  <a href="/events">Jelajahi Event</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastTickets.length > 0 ? (
            <div className="grid gap-4">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Belum ada riwayat tiket</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
