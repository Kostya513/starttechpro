"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Неверный email или пароль"
        : authError.message
      )
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#1A0A10] flex items-center justify-center">
                    <span className="text-xl font-bold shimmer-text">S</span>
                  </div>
                </div>
              </div>
              <div className="font-bold text-xl mx-2">
                <span className="text-2xl font-bold shimmer-text">S</span>
                <span className="text-[#D4AF37]">tart</span>
                <span className="text-2xl font-bold shimmer-text">T</span>
                <span className="text-[#D4AF37]">ech</span>
                <span className="text-2xl font-bold shimmer-text">P</span>
                <span className="text-[#D4AF37]">ro</span>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#FAFAFA] mt-6">Вход в портал</h1>
          <p className="text-[#FAFAFA]/70 mt-2">Войдите, чтобы управлять проектами</p>
        </div>

        <div className="glass rounded-xl p-8 neon-border">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-[#FAFAFA]/70">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-[#D4AF37] hover:text-[#7E2FE0] transition-colors">
                Зарегистрироваться
              </Link>
            </p>
            <p className="text-sm">
              <Link href="/login/reset" className="text-[#FAFAFA]/50 hover:text-[#D4AF37] transition-colors">
                Забыли пароль?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}