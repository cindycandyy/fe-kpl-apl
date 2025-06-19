export interface TicketType {
  id: string
  eventId: string
  name: TicketTypeName
  price: number
  quota: number
  sold: number
  description?: string
  features?: string[]
  createdAt: Date
  updatedAt: Date
}

export enum TicketTypeName {
  REGULAR = "Regular",
  VIP = "VIP",
  VVIP = "VVIP",
}
