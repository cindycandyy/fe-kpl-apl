"use client"

import { LoginForm } from "../components/auth/LoginForm"
import Link from "next/link"

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
