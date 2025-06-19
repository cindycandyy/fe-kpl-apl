"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Container } from "../../../infrastructure/di/Container"
import type { SeatRepository } from "../../../domain/repositories/SeatRepository"
import type { Seat } from "../../../domain/entities/Seat"

interface SeminarSeatSelectorProps {
  eventId: string
  userId: string
  requiredSeats: number
  onSeatsSelected: (seats: string[]) => void
  selectedSeats: string[]
}

export function SeminarSeatSelector({
  eventId,
  userId,
  requiredSeats,
  onSeatsSelected,
  selectedSeats,
}: SeminarSeatSelectorProps) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const seatRepository = Container.getInstance().get<SeatRepository>("seatRepository")

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true)
        const seatsData = await seatRepository.findByEventId(eventId)
        setSeats(seatsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load seats")
      } finally {
        setLoading(false)
      }
    }

    fetchSeats()
  }, [eventId, seatRepository])

  const handleSeatClick = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      // Remove seat
      const newSelection = selectedSeats.filter((s) => s !== seatNumber)
      onSeatsSelected(newSelection)
    } else if (selectedSeats.length < requiredSeats) {
      // Add seat
      const newSelection = [...selectedSeats, seatNumber]
      onSeatsSelected(newSelection)
    }
  }

  const getSeatStatus = (seat: Seat) => {
    if (seat.isBooked) return "booked"
    if (selectedSeats.includes(seat.seatNumber)) return "selected"
    return "available"
  }

  const getSeatVariant = (status: string) => {
    switch (status) {
      case "booked":
        return "destructive"
      case "selected":
        return "default"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div className="text-center py-4">Memuat kursi...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Group seats by row for better display
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Kursi Seminar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Pilih {requiredSeats} kursi untuk tiket Anda ({selectedSeats.length}/{requiredSeats} dipilih)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage indicator */}
        <div className="text-center">
          <div className="bg-muted rounded p-2 mb-4">
            <span className="text-sm font-medium">PANGGUNG</span>
          </div>
        </div>

        {/* Seat grid */}
        <div className="space-y-2">
          {Object.entries(seatsByRow).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-8 text-sm font-medium text-center">{row}</span>
              <div className="flex gap-1 flex-wrap">
                {rowSeats
                  .sort((a, b) => Number.parseInt(a.seatNumber.slice(1)) - Number.parseInt(b.seatNumber.slice(1)))
                  .map((seat) => {
                    const status = getSeatStatus(seat)
                    return (
                      <Button
                        key={seat.id}
                        variant={getSeatVariant(status)}
                        size="sm"
                        className="h-8 w-8 p-0 text-xs"
                        disabled={seat.isBooked}
                        onClick={() => handleSeatClick(seat.seatNumber)}
                      >
                        {seat.seatNumber.slice(1)}
                      </Button>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border rounded"></div>
            <span>Tersedia</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Dipilih</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Terpesan</span>
          </div>
        </div>

        {/* Selection status */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded">
            <p className="text-sm font-medium">Kursi yang dipilih:</p>
            <div className="flex gap-1 mt-1">
              {selectedSeats.map((seat) => (
                <Badge key={seat} variant="secondary">
                  {seat}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
