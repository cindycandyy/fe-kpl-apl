import type { RegisterUser, RegisterUserRequest } from "../../domain/usecases/RegisterUser"
import type { LoginUser, LoginUserRequest } from "../../domain/usecases/LoginUser"
import type { User } from "../../domain/entities/User"

export class AuthService {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
  ) {}

  async register(request: RegisterUserRequest): Promise<User> {
    return await this.registerUser.execute(request)
  }

  async login(request: LoginUserRequest): Promise<User> {
    return await this.loginUser.execute(request)
  }
}
