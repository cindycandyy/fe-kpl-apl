export interface Event {
  id: string
  title: string
  description: string
  longDescription?: string
  category: EventCategory
  type: EventType
  date: Date
  time: string
  endTime?: string
  location: string
  address?: string
  capacity: number
  sold: number
  status: EventStatus
  organizerId: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export enum EventCategory {
  KONSER = "konser",
  SEMINAR = "seminar",
  WORKSHOP = "workshop",
  EXHIBITION = "exhibition",
  FESTIVAL = "festival",
}

export enum EventType {
  SEMINAR = "seminar",
  CONCERT = "concert",
  EXHIBITION = "exhibition",
  WORKSHOP = "workshop",
}

export enum EventStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
