export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isVIP: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = "user",
  ORGANIZER = "organizer",
  ADMIN = "admin",
}
