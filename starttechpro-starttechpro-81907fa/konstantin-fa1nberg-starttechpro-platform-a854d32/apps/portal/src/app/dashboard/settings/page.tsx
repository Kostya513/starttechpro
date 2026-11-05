"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов")
      return
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSaved(true)
    setPassword("")
    setConfirmPassword("")
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">← Дашборд</span>
          </Link>
          <button onClick={handleLogout} className="text-sm text-[#FAFAFA]/50 hover:text-red-400 transition-colors">Выйти</button>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-8">Настройки</h1>

        <div className="glass rounded-xl p-8 neon-border">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Смена пароля</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">Пароль успешно изменён</div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-5 max-w-md">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Новый пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Подтвердите пароль</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full md:w-auto disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Изменить пароль"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}