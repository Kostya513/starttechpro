"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function NotificationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [preferences, setPreferences] = useState({
    email_project_updates: true,
    email_payment_confirmations: true,
    email_weekly_report: true,
    email_marketing: false,
    telegram_notifications: false,
    telegram_chat_id: "",
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      // Загружаем настройки из user_metadata
      const meta = user.user_metadata || {}
      setPreferences({
        email_project_updates: meta.email_project_updates !== false,
        email_payment_confirmations: meta.email_payment_confirmations !== false,
        email_weekly_report: meta.email_weekly_report !== false,
        email_marketing: meta.email_marketing === true,
        telegram_notifications: meta.telegram_notifications === true,
        telegram_chat_id: meta.telegram_chat_id || "",
      })
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const handleSave = async () => {
    setSaved(false)
    const { error } = await supabase.auth.updateUser({
      data: preferences,
    })
    if (!error) setSaved(true)
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
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-8">Уведомления</h1>

        {saved && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✅ Настройки сохранены
          </div>
        )}

        {/* Email-уведомления */}
        <div className="glass rounded-xl p-8 neon-border mb-6">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">📧 Email-уведомления</h2>
          <div className="space-y-4">
            {[
              { key: "email_project_updates", label: "Обновления проектов", desc: "Уведомления об изменении статуса ваших проектов" },
              { key: "email_payment_confirmations", label: "Подтверждения платежей", desc: "Квитанции об оплате и изменениях в подписке" },
              { key: "email_weekly_report", label: "Еженедельный отчёт", desc: "Статистика по проектам за неделю" },
              { key: "email_marketing", label: "Маркетинговые рассылки", desc: "Новости, акции и новые возможности платформы" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between glass rounded-lg p-4 cursor-pointer hover:bg-white/[0.02] transition-colors">
                <div>
                  <div className="text-sm text-[#FAFAFA]">{item.label}</div>
                  <div className="text-xs text-[#FAFAFA]/50 mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[item.key as keyof typeof preferences] as boolean}
                  onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-[#7E2FE0] text-[#7E2FE0] focus:ring-[#7E2FE0]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Telegram-уведомления */}
        <div className="glass rounded-xl p-8 neon-border mb-6">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">🤖 Telegram-уведомления</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between glass rounded-lg p-4 cursor-pointer hover:bg-white/[0.02] transition-colors">
              <div>
                <div className="text-sm text-[#FAFAFA]">Telegram-уведомления</div>
                <div className="text-xs text-[#FAFAFA]/50 mt-0.5">Мгновенные уведомления о статусе проектов</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.telegram_notifications}
                onChange={(e) => setPreferences({ ...preferences, telegram_notifications: e.target.checked })}
                className="w-4 h-4 rounded border-[#7E2FE0] text-[#7E2FE0] focus:ring-[#7E2FE0]"
              />
            </label>

            {preferences.telegram_notifications && (
              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Telegram Chat ID</label>
                <input
                  type="text"
                  value={preferences.telegram_chat_id}
                  onChange={(e) => setPreferences({ ...preferences, telegram_chat_id: e.target.value })}
                  placeholder="Например: 123456789"
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                />
                <span className="text-xs text-[#FAFAFA]/30">
                  Чтобы узнать ваш Chat ID, напишите @userinfobot в Telegram
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90"
        >
          Сохранить настройки
        </button>
      </main>
    </div>
  )
}