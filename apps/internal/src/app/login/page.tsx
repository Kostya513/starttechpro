"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

export default function InternalLoginPage() {
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

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#1A0A10] flex items-center justify-center">
                <span className="text-lg font-bold shimmer-text">S</span>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#FAFAFA]">Операционная зона</h1>
          <p className="text-sm text-[#FAFAFA]/50 mt-1">Вход для администраторов</p>
        </div>

        <div className="glass rounded-xl p-6 neon-border">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#FAFAFA]/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#FAFAFA]/70">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass rounded-xl px-4 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="gradient-neon rounded-lg px-6 py-2.5 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}