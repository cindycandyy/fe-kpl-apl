import type { BookingRepository } from "../../domain/repositories/BookingRepository"
import { type Booking, BookingStatus } from "../../domain/entities/Booking"

export class InMemoryBookingRepository implements BookingRepository {
  private bookings: Booking[] = []

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.id === id) || null
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookings.filter((booking) => booking.userId === userId)
  }

  async findByEventId(eventId: string): Promise<Booking[]> {
    return this.bookings.filter((booking) => booking.eventId === eventId)
  }

  async create(bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const booking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.bookings.push(booking)
    return booking
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking> {
    const index = this.bookings.findIndex((booking) => booking.id === id)

    if (index === -1) {
      throw new Error("Booking not found")
    }

    this.bookings[index] = {
      ...this.bookings[index],
      ...updates,
      updatedAt: new Date(),
    }

    return this.bookings[index]
  }

  async checkDoubleBooking(userId: string, eventId: string): Promise<boolean> {
    return this.bookings.some(
      (booking) =>
        booking.userId === userId && booking.eventId === eventId && booking.status !== BookingStatus.CANCELLED,
    )
  }

  async getUserBookingCount(userId: string, eventId: string): Promise<number> {
    return this.bookings
      .filter(
        (booking) =>
          booking.userId === userId && booking.eventId === eventId && booking.status !== BookingStatus.CANCELLED,
      )
      .reduce((total, booking) => total + booking.quantity, 0)
  }
}
