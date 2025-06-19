"use client"

import { useState } from "react"
import { Container } from "../../infrastructure/di/Container"
import type { AuthService } from "../../application/services/AuthService"
import type { RegisterUserRequest } from "../../domain/usecases/RegisterUser"
import type { LoginUserRequest } from "../../domain/usecases/LoginUser"
import { useAuth as useAuthContext } from "../contexts/AuthContext"

export function useAuth() {
  const { login: setUser } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authService = Container.getInstance().get<AuthService>("authService")

  const register = async (request: RegisterUserRequest) => {
    try {
      setLoading(true)
      setError(null)

      const user = await authService.register(request)
      setUser(user)

      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (request: LoginUserRequest) => {
    try {
      setLoading(true)
      setError(null)

      const user = await authService.login(request)
      setUser(user)

      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    login,
    loading,
    error,
  }
}
