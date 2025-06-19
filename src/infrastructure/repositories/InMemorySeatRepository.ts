import type { SeatRepository } from "../../domain/repositories/SeatRepository"
import type { Seat } from "../../domain/entities/Seat"
import { TicketTypeName } from "../../domain/entities/TicketType"

export class InMemorySeatRepository implements SeatRepository {
  private seats: Seat[] = [
    // Seminar seats
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `seat-${i + 1}`,
      eventId: "3", // Seminar event
      seatNumber: `A${i + 1}`,
      row: "A",
      section: "Main",
      isBooked: false,
      ticketType: TicketTypeName.REGULAR,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ]

  async findByEventId(eventId: string): Promise<Seat[]> {
    return this.seats.filter((seat) => seat.eventId === eventId)
  }

  async findAvailableSeats(eventId: string, ticketType: TicketTypeName): Promise<Seat[]> {
    return this.seats.filter((seat) => seat.eventId === eventId && seat.ticketType === ticketType && !seat.isBooked)
  }

  async reserveSeats(seatIds: string[], userId: string): Promise<void> {
    for (const seatId of seatIds) {
      const seatIndex = this.seats.findIndex((seat) => seat.id === seatId)
      if (seatIndex !== -1) {
        this.seats[seatIndex] = {
          ...this.seats[seatIndex],
          isBooked: true,
          bookedBy: userId,
          updatedAt: new Date(),
        }
      }
    }
  }

  async releaseSeats(seatIds: string[]): Promise<void> {
    for (const seatId of seatIds) {
      const seatIndex = this.seats.findIndex((seat) => seat.id === seatId)
      if (seatIndex !== -1) {
        this.seats[seatIndex] = {
          ...this.seats[seatIndex],
          isBooked: false,
          bookedBy: undefined,
          updatedAt: new Date(),
        }
      }
    }
  }
}
