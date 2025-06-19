import type { UserRepository } from "../repositories/UserRepository"
import type { User } from "../entities/User"
import { UserRole } from "../entities/User"

export interface RegisterUserRequest {
  name: string
  email: string
  password: string
  phone?: string
}

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: RegisterUserRequest): Promise<User> {
    // BR: Validate user data
    this.validateUserData(request)

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email)
    if (existingUser) {
      throw new Error("User dengan email ini sudah terdaftar")
    }

    // Create new user
    const userData = {
      name: request.name,
      email: request.email,
      phone: request.phone,
      role: UserRole.USER,
      isVIP: false, // Default to regular user
    }

    return await this.userRepository.create(userData)
  }

  private validateUserData(request: RegisterUserRequest): void {
    if (!request.name?.trim()) {
      throw new Error("Nama harus diisi")
    }

    if (!request.email?.trim()) {
      throw new Error("Email harus diisi")
    }

    if (!this.isValidEmail(request.email)) {
      throw new Error("Format email tidak valid")
    }

    if (!request.password || request.password.length < 6) {
      throw new Error("Password minimal 6 karakter")
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
