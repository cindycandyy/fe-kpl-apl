"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Minus, Plus, Star, Crown, Gem } from "lucide-react"
import type { TicketType } from "../../../domain/entities/TicketType"
import { TicketTypeName } from "../../../domain/entities/TicketType"

interface ConcertTicketSelectorProps {
  ticketTypes: TicketType[]
  selectedTickets: Record<string, number>
  onTicketChange: (ticketId: string, quantity: number) => void
  maxTicketsPerUser: number
  userCurrentBookings: number
}

export function ConcertTicketSelector({
  ticketTypes,
  selectedTickets,
  onTicketChange,
  maxTicketsPerUser,
  userCurrentBookings,
}: ConcertTicketSelectorProps) {
  const [error, setError] = useState<string | null>(null)

  // BR-2: Validate concert has all three required ticket types
  useEffect(() => {
    const requiredTypes = [TicketTypeName.REGULAR, TicketTypeName.VIP, TicketTypeName.VVIP]
    const availableTypes = ticketTypes.map((t) => t.name)
    const missingTypes = requiredTypes.filter((type) => !availableTypes.includes(type))

    if (missingTypes.length > 0) {
      setError(`Konser harus memiliki kategori: ${missingTypes.join(", ")}`)
    } else {
      setError(null)
    }
  }, [ticketTypes])

  const getTotalSelectedTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const getRemainingTickets = () => {
    return maxTicketsPerUser - userCurrentBookings - getTotalSelectedTickets()
  }

  const updateTicketQuantity = (ticketId: string, change: number) => {
    const currentQty = selectedTickets[ticketId] || 0
    const newQty = Math.max(0, currentQty + change)

    // BR-4: Check maximum tickets per user
    const totalAfterChange = getTotalSelectedTickets() - currentQty + newQty
    if (totalAfterChange + userCurrentBookings > maxTicketsPerUser) {
      return
    }

    // BR-3: Check quota availability
    const ticketType = ticketTypes.find((t) => t.id === ticketId)
    if (ticketType && newQty > ticketType.quota - ticketType.sold) {
      return
    }

    onTicketChange(ticketId, newQty)
  }

  const getTicketIcon = (ticketName: TicketTypeName) => {
    switch (ticketName) {
      case TicketTypeName.REGULAR:
        return <Star className="w-4 h-4" />
      case TicketTypeName.VIP:
        return <Crown className="w-4 h-4" />
      case TicketTypeName.VVIP:
        return <Gem className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTicketColor = (ticketName: TicketTypeName) => {
    switch (ticketName) {
      case TicketTypeName.REGULAR:
        return "border-blue-200 bg-blue-50"
      case TicketTypeName.VIP:
        return "border-purple-200 bg-purple-50"
      case TicketTypeName.VVIP:
        return "border-gold-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Tiket Konser</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Maksimal {maxTicketsPerUser} tiket per pengguna</span>
          <span>Sisa kuota: {getRemainingTickets()} tiket</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ticketTypes
          .sort((a, b) => {
            // Sort by ticket type hierarchy: Regular, VIP, VVIP
            const order = { [TicketTypeName.REGULAR]: 1, [TicketTypeName.VIP]: 2, [TicketTypeName.VVIP]: 3 }
            return order[a.name] - order[b.name]
          })
          .map((ticket) => {
            const available = ticket.quota - ticket.sold
            const selected = selectedTickets[ticket.id] || 0
            const maxSelectable = Math.min(available, getRemainingTickets() + selected)

            return (
              <div key={ticket.id} className={`border rounded-lg p-4 ${getTicketColor(ticket.name)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTicketIcon(ticket.name)}
                      <h4 className="font-medium">{ticket.name}</h4>
                      {ticket.name === TicketTypeName.VVIP && (
                        <Badge variant="secondary" className="text-xs">
                          EKSKLUSIF
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>

                    {/* Features list */}
                    {ticket.features && ticket.features.length > 0 && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {ticket.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Tersisa: {available}</Badge>
                      <span className="text-lg font-bold text-primary">Rp {ticket.price.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateTicketQuantity(ticket.id, -1)}
                      disabled={selected === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{selected}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateTicketQuantity(ticket.id, 1)}
                      disabled={available === 0 || selected >= maxSelectable}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {selected > 0 && (
                    <span className="font-medium">Rp {(ticket.price * selected).toLocaleString("id-ID")}</span>
                  )}
                </div>

                {/* Quota warning */}
                {available <= 5 && available > 0 && (
                  <p className="text-xs text-orange-600 mt-2">⚠️ Hanya tersisa {available} tiket!</p>
                )}
              </div>
            )
          })}

        {/* Summary */}
        {getTotalSelectedTickets() > 0 && (
          <div className="mt-4 p-3 bg-muted rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Tiket: {getTotalSelectedTickets()}</span>
              <span className="text-sm text-muted-foreground">Sisa kuota Anda: {getRemainingTickets()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
