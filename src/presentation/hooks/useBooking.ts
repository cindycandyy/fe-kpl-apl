"use client"

import { useState } from "react"
import { Container } from "../../infrastructure/di/Container"
import type { BookingService } from "../../application/services/BookingService"
import type { BookTicketRequest } from "../../domain/usecases/BookTicket"
import type { BookingWithDetails } from "../../domain/usecases/GetUserBookings"

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bookingService = Container.getInstance().get<BookingService>("bookingService")

  const bookTicket = async (request: BookTicketRequest) => {
    try {
      setLoading(true)
      setError(null)

      const booking = await bookingService.bookTicket(request)
      return booking
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Booking failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserBookings = async (userId: string): Promise<BookingWithDetails[]> => {
    try {
      setLoading(true)
      setError(null)

      return await bookingService.getUserBookings(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings")
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    bookTicket,
    getUserBookings,
    loading,
    error,
  }
}
