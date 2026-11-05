"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface InvestorData {
  isPlatformInvestor: boolean
  platformInvestment: {
    investmentAmount: number
    revenueShareRate: number
    multiplicationTarget: number
    currentMultiplication: number
    totalPaid: number
    isActive: boolean
    joinedAt: string
    lastPayoutAt: string | null
  } | null
  projectInvestments: Array<{
    id: string
    projectId: string
    amount: number
    equityShare: number | null
    status: string
    expectedRoi: number | null
    paidDividends: number
    createdAt: string
  }>
  balance: number
}

export default function InvestorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<InvestorData | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      try {
        const response = await fetch("/api/investor/stats")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Load investor data error:", error)
      }

      setLoading(false)
    }
    init()
  }, [supabase, router])

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

  const platform = data?.platformInvestment

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
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2">Инвестиции</h1>
        <p className="text-sm text-[#FAFAFA]/50 mb-8">
          Управляйте инвестициями в проекты и платформу StartTechPro
        </p>

        {/* Баланс */}
        <div className="glass rounded-xl p-6 neon-border mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#FAFAFA]/70">Баланс кошелька</div>
              <div className="text-3xl font-bold shimmer-text mt-1">
                {((data?.balance || 0) / 100).toLocaleString("ru-RU")} ₽
              </div>
            </div>
            <Link
              href="/dashboard/billing"
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90"
            >
              Пополнить
            </Link>
          </div>
        </div>

        {/* Инвестиции в платформу */}
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4">Инвестиции в платформу</h2>
        {platform ? (
          <div className="glass rounded-xl p-6 neon-border mb-8">
            <div className="grid gap-6 md:grid-cols-4 mb-6">
              <div>
                <div className="text-xs text-[#FAFAFA]/50">Сумма инвестиций</div>
                <div className="text-xl font-bold text-[#FAFAFA] mt-1">
                  {(platform.investmentAmount / 100).toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <div>
                <div className="text-xs text-[#FAFAFA]/50">Доля от MRR</div>
                <div className="text-xl font-bold text-[#D4AF37] mt-1">{platform.revenueShareRate}%</div>
              </div>
              <div>
                <div className="text-xs text-[#FAFAFA]/50">Текущая кратность</div>
                <div className="text-xl font-bold text-[#40E0D0] mt-1">X{platform.currentMultiplication.toFixed(2)}</div>
                <div className="text-xs text-[#FAFAFA]/40">Цель: X{platform.multiplicationTarget}</div>
              </div>
              <div>
                <div className="text-xs text-[#FAFAFA]/50">Всего выплачено</div>
                <div className="text-xl font-bold text-[#FAFAFA] mt-1">
                  {(platform.totalPaid / 100).toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </div>

            {/* Прогресс к X3 */}
            <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
              <div className="flex justify-between text-xs text-[#FAFAFA]/50 mb-2">
                <span>Прогресс к цели X{platform.multiplicationTarget}</span>
                <span>{Math.min(100, (platform.currentMultiplication / platform.multiplicationTarget) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#1A0A10] overflow-hidden border border-[#7E2FE0]/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7E2FE0] to-[#D4AF37] transition-all"
                  style={{ width: `${Math.min(100, (platform.currentMultiplication / platform.multiplicationTarget) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#FAFAFA]/30 mt-1">
                <span>X0</span>
                <span>X{platform.multiplicationTarget}</span>
              </div>
            </div>

            {platform.lastPayoutAt && (
              <div className="text-xs text-[#FAFAFA]/40 mt-4">
                Последняя выплата: {new Date(platform.lastPayoutAt).toLocaleDateString("ru-RU")}
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-xl p-6 neon-border mb-8 text-center">
            <div className="text-3xl mb-3">📈</div>
            <div className="text-sm text-[#FAFAFA]/70 mb-2">Станьте инвестором платформы</div>
            <div className="text-xs text-[#FAFAFA]/50 mb-4">
              Инвестируйте в StartTechPro и получайте % от ежемесячной выручки до достижения кратности X3
            </div>
            <button className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
              Стать инвестором
            </button>
          </div>
        )}

        {/* Инвестиции в проекты */}
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-4">Инвестиции в проекты</h2>
        <div className="glass rounded-xl neon-border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7E2FE0]/20">
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Проект</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Сумма</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Доля</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Статус</th>
                  <th className="text-right text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Выплачено</th>
                </tr>
              </thead>
              <tbody>
                {!data?.projectInvestments || data.projectInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#FAFAFA]/40">
                      У вас пока нет инвестиций в проекты
                    </td>
                  </tr>
                ) : (
                  data.projectInvestments.map((inv) => (
                    <tr key={inv.id} className="border-b border-[#7E2FE0]/10 last:border-0">
                      <td className="px-4 py-3 text-xs text-[#FAFAFA]/70 font-mono">{inv.projectId.slice(0, 12)}...</td>
                      <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">{(inv.amount / 100).toLocaleString("ru-RU")} ₽</td>
                      <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">{inv.equityShare ? `${inv.equityShare}%` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          inv.status === "active" ? "bg-[#40E0D0]/20 text-[#40E0D0]" :
                          inv.status === "completed" ? "bg-[#D4AF37]/20 text-[#D4AF37]" :
                          inv.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {inv.status === "active" ? "Активно" :
                           inv.status === "completed" ? "Завершено" :
                           inv.status === "pending" ? "Ожидает" : "Возвращено"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#D4AF37] text-right font-medium">
                        {(inv.paidDividends / 100).toLocaleString("ru-RU")} ₽
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Краудфандинг */}
        <div className="glass rounded-xl p-6 neon-border text-center">
          <div className="text-3xl mb-3">🚀</div>
          <div className="text-sm font-bold text-[#FAFAFA] mb-2">Хотите инвестировать в проект?</div>
          <div className="text-xs text-[#FAFAFA]/50 mb-4">
            Просмотрите доступные проекты для краудфандинга. StartTechPro берёт 5% за организацию сделки.
          </div>
          <button className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
            Смотреть проекты
          </button>
        </div>
      </main>
    </div>
  )
}