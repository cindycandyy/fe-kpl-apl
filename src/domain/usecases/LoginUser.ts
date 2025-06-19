import type { UserRepository } from "../repositories/UserRepository"
import type { User } from "../entities/User"

export interface LoginUserRequest {
  email: string
  password: string
}

export class LoginUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: LoginUserRequest): Promise<User> {
    if (!request.email?.trim() || !request.password?.trim()) {
      throw new Error("Email dan password harus diisi")
    }

    const user = await this.userRepository.authenticate(request.email, request.password)

    if (!user) {
      throw new Error("Email atau password salah")
    }

    return user
  }
}
