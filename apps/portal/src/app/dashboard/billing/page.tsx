"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { SUBSCRIPTION_PLANS } from "@/lib/pricing-calculator"

interface WalletData {
  balance: number
  subscriptionTier: string
  nextBillingDate: string | null
  isBlocked: boolean
  readOnlySince: string | null
}

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  balanceAfter: number
  description: string
  metadata: Record<string, unknown>
  createdAt: string
}

const TRANSACTION_LABELS: Record<string, string> = {
  topup: "Пополнение",
  subscription_deduction: "Подписка",
  infrastructure_purchase: "Инфраструктура",
  ai_usage: "AI-токены",
  payout: "Выплата",
  refund: "Возврат",
  partner_commission: "Партнёрская комиссия",
  royalty_deduction: "Роялти",
  investment_dividend: "Дивиденды",
}

const TRANSACTION_COLORS: Record<string, string> = {
  topup: "text-[#40E0D0]",
  subscription_deduction: "text-[#D4AF37]",
  infrastructure_purchase: "text-[#7E2FE0]",
  ai_usage: "text-[#3498db]",
  payout: "text-[#e74c3c]",
  refund: "text-[#2ecc71]",
  partner_commission: "text-[#f39c12]",
  royalty_deduction: "text-[#9b59b6]",
  investment_dividend: "text-[#1abc9c]",
}

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [topupAmount, setTopupAmount] = useState(50000)
  const [topupLoading, setTopupLoading] = useState(false)
  const [acceptedTariffs, setAcceptedTariffs] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview")

  const success = searchParams.get("success") === "true"

  const loadWallet = useCallback(async () => {
    try {
      const response = await fetch("/api/wallet/balance")
      if (response.ok) {
        const data = await response.json()
        setWallet(data)
      }
    } catch (error) {
      console.error("Load wallet error:", error)
    }
  }, [])

  const loadTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/wallet/transactions?limit=20")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Load transactions error:", error)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      await Promise.all([loadWallet(), loadTransactions()])
      setLoading(false)
    }
    init()
  }, [supabase, router, loadWallet, loadTransactions])

  const handleTopup = async () => {
    if (!acceptedTariffs) {
      alert("Необходимо подтвердить ознакомление с тарифами и условиями списаний")
      return
    }

    setTopupLoading(true)
    try {
      const response = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: topupAmount,
          description: `Пополнение кошелька на ${(topupAmount / 100).toLocaleString("ru-RU")} ₽`,
        }),
      })

      const data = await response.json()
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl
      } else {
        alert("Ошибка создания платежа: " + (data.error || "Неизвестная ошибка"))
      }
    } catch {
      alert("Ошибка соединения")
    }
    setTopupLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const presetAmounts = [50000, 100000, 300000, 500000, 1000000]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка...</div>
      </div>
    )
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === wallet?.subscriptionTier)

  return (
    <div className="min-h-screen">
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">← Дашборд</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/billing/breakdown" className="text-xs text-[#FAFAFA]/50 hover:text-[#D4AF37] transition-colors">
              Детализация цен
            </Link>
            <button onClick={handleLogout} className="text-sm text-[#FAFAFA]/50 hover:text-red-400 transition-colors">Выйти</button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            ✅ Платёж успешно выполнен! Средства зачислены на кошелёк.
          </div>
        )}

        {wallet?.isBlocked && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            🚫 Сервис приостановлен из-за нулевого баланса. Пополните кошелёк для восстановления доступа.
          </div>
        )}

        {wallet?.readOnlySince && !wallet.isBlocked && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
            ⚠️ Режим «Только чтение». Редактирование проектов заблокировано. Пополните баланс для восстановления полного доступа.
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Биллинг</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-[#7E2FE0]/30 text-[#FAFAFA] border border-[#7E2FE0]/50"
                  : "text-[#FAFAFA]/50 hover:text-[#FAFAFA] border border-transparent"
              }`}
            >
              Обзор
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-xs px-4 py-2 rounded-lg transition-all ${
                activeTab === "history"
                  ? "bg-[#7E2FE0]/30 text-[#FAFAFA] border border-[#7E2FE0]/50"
                  : "text-[#FAFAFA]/50 hover:text-[#FAFAFA] border border-transparent"
              }`}
            >
              История
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Баланс */}
            <div className="glass rounded-xl p-6 neon-border mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#FAFAFA]/70">Баланс кошелька</div>
                  <div className="text-4xl font-bold shimmer-text mt-1">
                    {wallet ? (wallet.balance / 100).toLocaleString("ru-RU") : "0"} ₽
                  </div>
                  {wallet && wallet.balance < 50000 && wallet.balance > 0 && (
                    <div className="text-xs text-yellow-400 mt-2">
                      ⚠️ Низкий баланс. Пополните, чтобы избежать блокировки сервиса.
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setShowTopupModal(true); setAcceptedTariffs(false) }}
                  className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90"
                >
                  Пополнить
                </button>
              </div>
            </div>

            {/* Текущий тариф */}
            <div className="glass rounded-xl p-6 neon-border mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#FAFAFA]/70">Текущий тариф</div>
                  <div className="text-xl font-bold text-[#D4AF37] mt-1">
                    {currentPlan?.name || "Starter"}
                  </div>
                  <div className="text-xs text-[#FAFAFA]/50 mt-1">
                    {wallet?.nextBillingDate
                      ? `Следующее списание: ${new Date(wallet.nextBillingDate).toLocaleDateString("ru-RU")}`
                      : "Дата следующего списания не установлена"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FAFAFA]">
                    {currentPlan ? (currentPlan.monthlyPrice / 100).toLocaleString("ru-RU") : "0"} ₽
                  </div>
                  <div className="text-xs text-[#FAFAFA]/50">в месяц</div>
                </div>
              </div>
            </div>

            {/* Тарифы */}
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-6">Доступные тарифы</h2>
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = wallet?.subscriptionTier === plan.id
                return (
                  <div key={plan.id} className={`glass rounded-xl p-6 neon-border flex flex-col ${isCurrent ? "ring-2 ring-[#D4AF37]" : ""} ${plan.highlighted ? "relative" : ""}`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#7E2FE0] text-[10px] text-white font-bold px-4 py-1 rounded-full">
                        Рекомендуем
                      </div>
                    )}
                    {isCurrent && (
                      <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold mb-2 text-center">Текущий тариф</div>
                    )}
                    <div className="text-center mb-6 mt-2">
                      <div className="text-2xl font-bold text-[#FAFAFA] mb-1">{plan.name}</div>
                      <div className="text-3xl font-bold shimmer-text">{(plan.monthlyPrice / 100).toLocaleString("ru-RU")} ₽</div>
                      <div className="text-xs text-[#FAFAFA]/50">в месяц</div>
                      <div className="text-xs text-[#FAFAFA]/30 mt-1">
                        {(plan.annualPrice / 100).toLocaleString("ru-RU")} ₽/год (экономия ~17%)
                      </div>
                    </div>
                    <ul className="space-y-2 flex-1 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                          <span className="text-[#40E0D0]">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      disabled={isCurrent}
                      className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCurrent ? "Текущий тариф" : `Перейти на ${plan.name}`}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Быстрые ссылки */}
            <div className="grid gap-4 md:grid-cols-3 mb-10">
              <Link href="/dashboard/billing/breakdown" className="glass rounded-xl p-4 neon-border hover:opacity-80 transition-all">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">📊 Детализация цен</div>
                <div className="text-xs text-[#FAFAFA]/50">Прозрачная разбивка всех статей расходов</div>
              </Link>
              <Link href="/tariffs-and-conditions" className="glass rounded-xl p-4 neon-border hover:opacity-80 transition-all">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">📋 Тарифы и условия</div>
                <div className="text-xs text-[#FAFAFA]/50">Полное описание комиссий и правил оплаты</div>
              </Link>
              <Link href="/dashboard/support" className="glass rounded-xl p-4 neon-border hover:opacity-80 transition-all">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">💬 Поддержка</div>
                <div className="text-xs text-[#FAFAFA]/50">Связаться с финансовым отделом</div>
              </Link>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <>
            {/* История транзакций */}
            <div className="glass rounded-xl neon-border overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#7E2FE0]/20">
                      <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Дата</th>
                      <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Тип</th>
                      <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Описание</th>
                      <th className="text-right text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Сумма</th>
                      <th className="text-right text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Баланс после</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#FAFAFA]/40">
                          История транзакций пуста
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => {
                        const isCredit = ["topup", "refund", "partner_commission", "investment_dividend"].includes(tx.type)
                        return (
                          <tr key={tx.id} className="border-b border-[#7E2FE0]/10 last:border-0 hover:bg-[#7E2FE0]/5 transition-colors">
                            <td className="px-4 py-3 text-xs text-[#FAFAFA]/40 whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${TRANSACTION_COLORS[tx.type] || "text-[#FAFAFA]/50"} bg-current/10`}>
                                {TRANSACTION_LABELS[tx.type] || tx.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">{tx.description}</td>
                            <td className={`px-4 py-3 text-xs text-right font-medium ${isCredit ? "text-[#40E0D0]" : "text-red-400"}`}>
                              {isCredit ? "+" : "-"}{(tx.amount / 100).toLocaleString("ru-RU")} ₽
                            </td>
                            <td className="px-4 py-3 text-xs text-[#FAFAFA]/70 text-right">
                              {(tx.balanceAfter / 100).toLocaleString("ru-RU")} ₽
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(TRANSACTION_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={async () => {
                    const response = await fetch(`/api/wallet/transactions?limit=20&type=${key}`)
                    if (response.ok) {
                      const data = await response.json()
                      setTransactions(data.transactions || [])
                    }
                  }}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                    TRANSACTION_COLORS[key] || "text-[#FAFAFA]/50"
                  } border-current/30 hover:bg-current/10`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={loadTransactions}
                className="text-[10px] px-3 py-1.5 rounded-full border border-[#FAFAFA]/20 text-[#FAFAFA]/50 hover:bg-[#FAFAFA]/10 transition-all"
              >
                Все
              </button>
            </div>
          </>
        )}
      </main>

      {/* Модалка пополнения */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowTopupModal(false)}>
          <div className="glass rounded-xl p-8 neon-border max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#FAFAFA]">Пополнение кошелька</h2>
              <button onClick={() => setShowTopupModal(false)} className="text-[#FAFAFA]/50 hover:text-[#FAFAFA] text-xl">&times;</button>
            </div>

            <div className="mb-6">
              <div className="text-sm text-[#FAFAFA]/70 mb-3">Выберите сумму</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount)}
                    className={`px-4 py-3 rounded-lg text-sm font-bold transition-all border ${
                      topupAmount === amount
                        ? "bg-[#7E2FE0]/30 border-[#7E2FE0] text-[#FAFAFA]"
                        : "bg-transparent border-[#7E2FE0]/30 text-[#FAFAFA]/70 hover:border-[#7E2FE0]/60"
                    }`}
                  >
                    {(amount / 100).toLocaleString("ru-RU")} ₽
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1A0A10] border border-[#7E2FE0]/30 rounded-lg px-4 py-3 text-[#FAFAFA] text-sm outline-none focus:border-[#7E2FE0] transition-colors"
                  placeholder="Своя сумма"
                  min={10000}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FAFAFA]/50 text-sm">₽</span>
              </div>
              <div className="text-xs text-[#FAFAFA]/40 mt-2">Минимальная сумма: 100 ₽</div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-[#7E2FE0]/10 border border-[#7E2FE0]/20">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#FAFAFA]/70">Сумма пополнения</span>
                <span className="text-[#FAFAFA] font-bold">{(topupAmount / 100).toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#FAFAFA]/70">Способ оплаты</span>
                <span className="text-[#FAFAFA]">Карта / СБП</span>
              </div>
            </div>

            {/* Чекбокс: ознакомление с тарифами */}
            <label className="flex items-start gap-3 text-sm text-[#FAFAFA]/70 mb-4">
              <input
                type="checkbox"
                checked={acceptedTariffs}
                onChange={(e) => setAcceptedTariffs(e.target.checked)}
                required
                className="mt-0.5 shrink-0"
              />
              <span>
                Я подтверждаю, что ознакомлен(а) с{' '}
                <a href="/tariffs-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                  тарифами и условиями списаний
                </a>
              </span>
            </label>

            <button
              onClick={handleTopup}
              disabled={topupLoading || topupAmount < 10000 || !acceptedTariffs}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full disabled:opacity-50"
            >
              {topupLoading ? "Создание платежа..." : `Пополнить на ${(topupAmount / 100).toLocaleString("ru-RU")} ₽`}
            </button>

            <div className="text-[10px] text-[#FAFAFA]/30 text-center mt-4">
              Оплата через YooKassa. Безопасный платёж по 152-ФЗ.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}