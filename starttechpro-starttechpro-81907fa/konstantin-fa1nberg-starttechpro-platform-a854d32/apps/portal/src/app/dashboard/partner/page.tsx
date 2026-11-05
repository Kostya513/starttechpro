"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface PartnerStats {
  referralCode: string
  referralLink: string
  totalEarnings: number
  activeReferrals: number
  balance: number
  commissionRate: number
  referrals: Array<{
    id: string
    referredUserId: string
    commissionRate: number
    lifetimeEarnings: number
    status: string
    createdAt: string
  }>
}

export default function PartnerPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<PartnerStats | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      try {
        const response = await fetch("/api/partner/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Load partner stats error:", error)
      }

      setLoading(false)
    }
    init()
  }, [supabase, router])

  const copyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2">Партнёрская программа</h1>
        <p className="text-sm text-[#FAFAFA]/50 mb-8">
          Привлекайте клиентов и получайте 20% от их подписки пожизненно
        </p>

        {/* Статистика */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Активные рефералы</div>
            <div className="text-3xl font-bold shimmer-text">{stats?.activeReferrals || 0}</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Заработано всего</div>
            <div className="text-3xl font-bold shimmer-text">{((stats?.totalEarnings || 0) / 100).toLocaleString("ru-RU")} ₽</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Комиссия</div>
            <div className="text-3xl font-bold shimmer-text">{stats?.commissionRate || 20}%</div>
            <div className="text-xs text-[#FAFAFA]/40">пожизненно с подписки</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Баланс кошелька</div>
            <div className="text-3xl font-bold shimmer-text">{((stats?.balance || 0) / 100).toLocaleString("ru-RU")} ₽</div>
          </div>
        </div>

        {/* Реферальная ссылка */}
        <div className="glass rounded-xl p-6 neon-border mb-8">
          <div className="text-sm font-bold text-[#FAFAFA] mb-3">Ваша реферальная ссылка</div>
          <div className="flex gap-3">
            <input
              type="text"
              readOnly
              value={stats?.referralLink || "Загрузка..."}
              className="flex-1 bg-[#1A0A10] border border-[#7E2FE0]/30 rounded-lg px-4 py-3 text-sm text-[#FAFAFA] outline-none"
            />
            <button
              onClick={copyLink}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 whitespace-nowrap"
            >
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </div>
          <div className="text-xs text-[#FAFAFA]/40 mt-2">
            Делитесь этой ссылкой — при регистрации клиент автоматически привяжется к вам
          </div>
        </div>

        {/* Как это работает */}
        <div className="glass rounded-xl p-6 neon-border mb-8">
          <h2 className="text-lg font-bold text-[#FAFAFA] mb-4">Как это работает</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
              <div className="w-8 h-8 rounded-full bg-[#7E2FE0]/20 flex items-center justify-center text-sm mb-3">1</div>
              <div className="text-sm font-bold text-[#FAFAFA] mb-1">Поделитесь ссылкой</div>
              <div className="text-xs text-[#FAFAFA]/50">Отправьте реферальную ссылку клиентам, разместите на сайте или в соцсетях</div>
            </div>
            <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
              <div className="w-8 h-8 rounded-full bg-[#7E2FE0]/20 flex items-center justify-center text-sm mb-3">2</div>
              <div className="text-sm font-bold text-[#FAFAFA] mb-1">Клиент регистрируется</div>
              <div className="text-xs text-[#FAFAFA]/50">При переходе по ссылке клиент автоматически привязывается к вам как к партнёру</div>
            </div>
            <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
              <div className="w-8 h-8 rounded-full bg-[#7E2FE0]/20 flex items-center justify-center text-sm mb-3">3</div>
              <div className="text-sm font-bold text-[#FAFAFA] mb-1">Получаете 20% пожизненно</div>
              <div className="text-xs text-[#FAFAFA]/50">С каждой оплаты подписки клиента 20% автоматически зачисляется на ваш кошелёк</div>
            </div>
          </div>
        </div>

        {/* График доходов (заглушка) */}
        <div className="glass rounded-xl p-6 neon-border mb-8">
          <h2 className="text-lg font-bold text-[#FAFAFA] mb-4">График доходов</h2>
          <div className="h-48 flex items-center justify-center bg-[#1A0A10] rounded-lg border border-[#7E2FE0]/10">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-sm text-[#FAFAFA]/50">График доходов появится после первых привлечённых клиентов</div>
            </div>
          </div>
        </div>

        {/* Список рефералов */}
        <h2 className="text-lg font-bold text-[#FAFAFA] mb-4">Привлечённые клиенты</h2>
        <div className="glass rounded-xl neon-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7E2FE0]/20">
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">ID клиента</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Дата регистрации</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Статус</th>
                  <th className="text-right text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Заработано</th>
                </tr>
              </thead>
              <tbody>
                {!stats?.referrals || stats.referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-xs text-[#FAFAFA]/40">
                      Пока нет привлечённых клиентов. Поделитесь реферальной ссылкой!
                    </td>
                  </tr>
                ) : (
                  stats.referrals.map((ref) => (
                    <tr key={ref.id} className="border-b border-[#7E2FE0]/10 last:border-0">
                      <td className="px-4 py-3 text-xs text-[#FAFAFA]/70 font-mono">{ref.referredUserId.slice(0, 12)}...</td>
                      <td className="px-4 py-3 text-xs text-[#FAFAFA]/40">
                        {new Date(ref.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          ref.status === "active" ? "bg-[#40E0D0]/20 text-[#40E0D0]" : "bg-red-500/20 text-red-400"
                        }`}>
                          {ref.status === "active" ? "Активен" : "Заблокирован"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#D4AF37] text-right font-medium">
                        {(ref.lifetimeEarnings / 100).toLocaleString("ru-RU")} ₽
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}