"use client"

import Link from "next/link"
import { getAllServicePrices, SUBSCRIPTION_PLANS } from "@/lib/pricing-calculator"

export default function BillingBreakdownPage() {
  const services = getAllServicePrices()

  const totalMonthly = services
    .filter((s) => s.isRecurring && s.period === "month")
    .reduce((sum, s) => sum + s.breakdown.final, 0)

  const totalYearly = services
    .filter((s) => s.isRecurring && s.period === "year")
    .reduce((sum, s) => sum + s.breakdown.final, 0)

  return (
    <div className="min-h-screen">
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard/billing" className="flex items-center gap-2">
            <span className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">← Биллинг</span>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2">Детализация цен</h1>
        <p className="text-sm text-[#FAFAFA]/50 mb-8">
          Прозрачная разбивка всех статей расходов. StartTechPro работает с фиксированной наценкой на закупочные цены.
        </p>

        {/* Сводка */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Ежемесячные расходы</div>
            <div className="text-2xl font-bold shimmer-text">{(totalMonthly / 100).toLocaleString("ru-RU")} ₽</div>
            <div className="text-xs text-[#FAFAFA]/40 mt-1">хостинг + подписка</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">Ежегодные расходы</div>
            <div className="text-2xl font-bold shimmer-text">{(totalYearly / 100).toLocaleString("ru-RU")} ₽</div>
            <div className="text-xs text-[#FAFAFA]/40 mt-1">домены</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm text-[#FAFAFA]/70 mb-1">AI-токены</div>
            <div className="text-2xl font-bold shimmer-text">от 0.02 ₽</div>
            <div className="text-xs text-[#FAFAFA]/40 mt-1">за 1K токенов (зависит от модели)</div>
          </div>
        </div>

        {/* Услуги */}
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-6">Все услуги</h2>
        <div className="space-y-4 mb-10">
          {services.map((service) => {
            const { breakdown } = service
            return (
              <div key={service.id} className="glass rounded-xl p-6 neon-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-base font-bold text-[#FAFAFA]">{service.name}</div>
                    <div className="text-xs text-[#FAFAFA]/50 mt-1">{service.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold shimmer-text">{(breakdown.final / 100).toLocaleString("ru-RU")} ₽</div>
                    {service.isRecurring && (
                      <div className="text-[10px] text-[#FAFAFA]/40">
                        {service.period === "month" ? "в месяц" : "в год"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Детализация */}
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#FAFAFA]/50">Закупочная цена</span>
                      <span className="text-[#FAFAFA]/70">{(breakdown.cost / 100).toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#FAFAFA]/50">Наценка платформы ({breakdown.markupPercent}%)</span>
                      <span className="text-[#D4AF37]">+{(breakdown.markupAmount / 100).toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <div className="border-t border-[#7E2FE0]/10 pt-2 flex justify-between">
                      <span className="text-[#FAFAFA]/70 font-bold">Итого</span>
                      <span className="text-[#FAFAFA] font-bold">{(breakdown.final / 100).toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-[#FAFAFA]/30 italic">
                    {breakdown.justification}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Комиссии */}
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-6">Комиссии платформы</h2>
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm font-bold text-[#FAFAFA] mb-2">Prompt Studio</div>
            <div className="text-2xl font-bold shimmer-text mb-2">10–15%</div>
            <div className="text-xs text-[#FAFAFA]/50">Комиссия с каждой сделки в маркетплейсе промптов</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm font-bold text-[#FAFAFA] mb-2">White-Label</div>
            <div className="text-2xl font-bold shimmer-text mb-2">15–25%</div>
            <div className="text-xs text-[#FAFAFA]/50">Роялти с выручки партнёров по White-Label лицензии</div>
          </div>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="text-sm font-bold text-[#FAFAFA] mb-2">Краудфандинг</div>
            <div className="text-2xl font-bold shimmer-text mb-2">5%</div>
            <div className="text-xs text-[#FAFAFA]/50">За организацию сделки и юридическое сопровождение</div>
          </div>
        </div>

        {/* Планы подписки */}
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-6">Планы подписки</h2>
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className={`glass rounded-xl p-6 neon-border ${plan.highlighted ? "ring-2 ring-[#D4AF37]" : ""}`}>
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-[#FAFAFA]">{plan.name}</div>
                <div className="text-3xl font-bold shimmer-text mt-2">{(plan.monthlyPrice / 100).toLocaleString("ru-RU")} ₽</div>
                <div className="text-xs text-[#FAFAFA]/50">в месяц</div>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                    <span className="text-[#40E0D0]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/dashboard/billing"
            className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 inline-block"
          >
            Вернуться в биллинг
          </Link>
        </div>
      </main>
    </div>
  )
}