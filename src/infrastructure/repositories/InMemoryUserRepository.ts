import type { UserRepository } from "../../domain/repositories/UserRepository"
import { type User, UserRole } from "../../domain/entities/User"

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+62812345678",
      role: UserRole.USER,
      isVIP: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "user2",
      name: "Jane VIP",
      email: "jane@example.com",
      phone: "+62812345679",
      role: UserRole.USER,
      isVIP: true,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ]

  private passwords: Map<string, string> = new Map([
    ["john@example.com", "password123"],
    ["jane@example.com", "password123"],
  ])

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)
    return user
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id)

    if (index === -1) {
      throw new Error("User not found")
    }

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date(),
    }

    return this.users[index]
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const storedPassword = this.passwords.get(email)

    if (storedPassword !== password) {
      return null
    }

    return this.findByEmail(email)
  }
}
