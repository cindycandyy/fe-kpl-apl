import type { User } from "../entities/User"

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>
  update(id: string, user: Partial<User>): Promise<User>
  authenticate(email: string, password: string): Promise<User | null>
}
