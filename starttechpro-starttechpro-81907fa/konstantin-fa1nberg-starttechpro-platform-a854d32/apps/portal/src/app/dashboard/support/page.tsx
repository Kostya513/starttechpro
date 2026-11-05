"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function SupportPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("general")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, category }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка отправки")
      }

      setSent(true)
      setSubject("")
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки сообщения")
    }

    setSending(false)
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
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-8">Поддержка</h1>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="glass rounded-xl p-6 neon-border text-center">
            <div className="text-3xl mb-2">📧</div>
            <div className="text-sm font-semibold text-[#FAFAFA]">Email</div>
            <div className="text-xs text-[#FAFAFA]/50 mt-1">support@starttechpro.ru</div>
            <div className="text-xs text-[#FAFAFA]/30 mt-1">Ответ в течение 24 часов</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-sm font-semibold text-[#FAFAFA]">Telegram</div>
            <div className="text-xs text-[#FAFAFA]/50 mt-1">@starttechpro_support</div>
            <div className="text-xs text-[#FAFAFA]/30 mt-1">Ответ в течение 2 часов</div>
          </div>
        </div>

        <div className="glass rounded-xl p-8 neon-border">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Написать нам</h2>

          {sent ? (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              ✅ Сообщение отправлено! Мы ответим в ближайшее время.
              <button
                onClick={() => setSent(false)}
                className="block mx-auto mt-3 text-xs text-[#D4AF37] hover:text-[#7E2FE0] transition-colors"
              >
                Написать ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                >
                  <option value="general">Общий вопрос</option>
                  <option value="technical">Техническая проблема</option>
                  <option value="billing">Оплата и тарифы</option>
                  <option value="feature">Предложение по улучшению</option>
                  <option value="bug">Сообщить об ошибке</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Тема</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Кратко опишите вопрос"
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Сообщение</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Опишите ваш вопрос или проблему..."
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 disabled:opacity-50 w-full md:w-auto"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Отправка...
                  </span>
                ) : (
                  "Отправить"
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}