"use client"

import { RegisterForm } from "../components/auth/RegisterForm"
import Link from "next/link"

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
