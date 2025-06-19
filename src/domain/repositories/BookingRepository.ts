import type { Booking } from "../entities/Booking"

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>
  findByUserId(userId: string): Promise<Booking[]>
  findByEventId(eventId: string): Promise<Booking[]>
  create(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking>
  update(id: string, booking: Partial<Booking>): Promise<Booking>
  checkDoubleBooking(userId: string, eventId: string): Promise<boolean>
  getUserBookingCount(userId: string, eventId: string): Promise<number>
}
