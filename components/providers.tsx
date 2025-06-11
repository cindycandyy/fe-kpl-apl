"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "organizer" | "user"
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isOrganizer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "John Organizer",
    email: "john@example.com",
    role: "organizer",
  })

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const isOrganizer = user?.role === "organizer"

  return <AuthContext.Provider value={{ user, login, logout, isOrganizer }}>{children}</AuthContext.Provider>
}
