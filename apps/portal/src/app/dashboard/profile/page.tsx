"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUser(user)
      setName(user.user_metadata?.full_name || "")
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    })

    if (!error) setSaved(true)
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

  const initials = (user?.user_metadata?.full_name || user?.email?.split("@")[0] || "П").charAt(0).toUpperCase()

  return (
    <div className="min-h-screen">
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">← Дашборд</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-sm text-[#FAFAFA]/50 hover:text-red-400 transition-colors">Выйти</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] flex items-center justify-center text-sm font-bold text-white">{initials}</div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-8">Профиль</h1>

        <div className="glass rounded-xl p-8 neon-border">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <div>
              <div className="text-lg font-semibold text-[#FAFAFA]">{user?.user_metadata?.full_name || "Пользователь"}</div>
              <div className="text-sm text-[#FAFAFA]/50">{user?.email}</div>
              <div className="text-xs text-[#FAFAFA]/30 mt-1">
                Зарегистрирован: {new Date(user?.created_at || "").toLocaleDateString("ru-RU")}
              </div>
            </div>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Профиль обновлён
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA]/50 placeholder:text-[#FAFAFA]/30 focus:outline-none cursor-not-allowed"
              />
              <span className="text-xs text-[#FAFAFA]/30">Email нельзя изменить. Для смены email обратитесь в поддержку.</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full md:w-auto disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}