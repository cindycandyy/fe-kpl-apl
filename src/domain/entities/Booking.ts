export interface Booking {
  id: string
  userId: string
  eventId: string
  ticketTypeId: string
  quantity: number
  totalPrice: number
  status: BookingStatus
  bookingDate: Date
  seatNumbers?: string[]
  visitSchedule?: Date // For VIP users
  createdAt: Date
  updatedAt: Date
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}
