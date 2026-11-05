"use client"

import { useEffect, useState } from "react"
import { getPlatformMetrics, getDailyMetrics, getTopPages, getTrafficSources } from "@/lib/analytics"
import type { AnalyticsMetrics, DailyMetric, TopPage, TrafficSource } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([])
  const [topPages, setTopPages] = useState<TopPage[]>([])
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, d, p, s] = await Promise.all([
          getPlatformMetrics(),
          getDailyMetrics(30),
          getTopPages(30),
          getTrafficSources(30),
        ])
        setMetrics(m)
        setDailyMetrics(d)
        setTopPages(p)
        setTrafficSources(s)
      } catch (error) {
        console.error("Analytics load error:", error)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка аналитики...</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="text-red-400 text-sm">Ошибка загрузки аналитики</div>
      </div>
    )
  }

  const mrr = metrics.mrr
  const arr = mrr * 12
  const ltv = metrics.totalUsers > 0 ? Math.round((mrr * 12) / metrics.totalUsers) : 0
  const arpu = metrics.totalUsers > 0 ? Math.round(mrr / metrics.totalUsers) : 0
  const arppu = metrics.subscriptions > 0 ? Math.round(mrr / metrics.subscriptions) : 0
  const churnRate = metrics.totalUsers > 0 ? ((metrics.totalUsers - metrics.activeUsers) / metrics.totalUsers * 100).toFixed(1) : "0"
  const retentionRate = (100 - parseFloat(churnRate)).toFixed(1)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Аналитика</h1>
          <p className="text-sm text-[#FAFAFA]/50 mt-1">Ключевые метрики платформы</p>
        </div>
        <div className="flex gap-2">
          <select className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] focus:outline-none">
            <option>Последние 30 дней</option>
            <option>Последние 7 дней</option>
            <option>Последние 90 дней</option>
          </select>
          <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] hover:bg-white/[0.04] transition-all">
            Экспорт PDF
          </button>
        </div>
      </div>

      {/* KPI-панель */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="glass rounded-xl p-5 neon-border">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">MRR (месячная выручка)</div>
          <div className="text-2xl font-bold shimmer-text">{formatCurrency(mrr)}</div>
          <div className="text-xs text-[#40E0D0] mt-1">На основе активных подписок</div>
        </div>
        <div className="glass rounded-xl p-5 neon-border">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">ARR (годовая выручка)</div>
          <div className="text-2xl font-bold text-[#D4AF37]">{formatCurrency(arr)}</div>
          <div className="text-xs text-[#FAFAFA]/40 mt-1">Run rate (MRR × 12)</div>
        </div>
        <div className="glass rounded-xl p-5 neon-border">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">LTV (пожизненная ценность)</div>
          <div className="text-2xl font-bold text-[#40E0D0]">{formatCurrency(ltv)}</div>
          <div className="text-xs text-[#FAFAFA]/40 mt-1">На пользователя</div>
        </div>
        <div className="glass rounded-xl p-5 neon-border">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">Churn Rate</div>
          <div className="text-2xl font-bold text-red-400">{churnRate}%</div>
          <div className="text-xs text-[#FAFAFA]/40 mt-1">Цель: &lt; 3%</div>
        </div>
      </div>

      {/* Дополнительные KPI */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <div className="glass rounded-xl p-4 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50">Всего пользователей</div>
          <div className="text-xl font-bold text-[#FAFAFA]">{metrics.totalUsers}</div>
        </div>
        <div className="glass rounded-xl p-4 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50">Активных</div>
          <div className="text-xl font-bold text-[#40E0D0]">{metrics.activeUsers}</div>
        </div>
        <div className="glass rounded-xl p-4 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50">ARPU</div>
          <div className="text-xl font-bold text-[#D4AF37]">{formatCurrency(arpu)}</div>
        </div>
        <div className="glass rounded-xl p-4 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50">ARPPU</div>
          <div className="text-xl font-bold text-[#BA55D3]">{formatCurrency(arppu)}</div>
        </div>
        <div className="glass rounded-xl p-4 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50">Retention</div>
          <div className="text-xl font-bold text-[#40E0D0]">{retentionRate}%</div>
        </div>
      </div>

      {/* График метрик */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-sm font-semibold text-[#FAFAFA] mb-4">Динамика просмотров</h2>
          {dailyMetrics.length === 0 ? (
            <div className="text-center py-8 text-[#FAFAFA]/40 text-xs">Нет данных за период</div>
          ) : (
            <div className="space-y-1">
              {dailyMetrics.slice(-14).map((point) => {
                const maxViews = Math.max(...dailyMetrics.map(p => p.pageViews), 1)
                const height = (point.pageViews / maxViews) * 100
                return (
                  <div key={point.date} className="flex items-center gap-3 text-xs">
                    <span className="text-[#FAFAFA]/40 w-24 shrink-0">{point.date}</span>
                    <div className="flex-1 h-4 rounded-full bg-[#1A0A10]/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7E2FE0] to-[#3498db]"
                        style={{ width: `${height}%` }}
                      />
                    </div>
                    <span className="text-[#FAFAFA]/60 w-16 text-right">{point.pageViews}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-sm font-semibold text-[#FAFAFA] mb-4">Конверсии</h2>
          {dailyMetrics.length === 0 ? (
            <div className="text-center py-8 text-[#FAFAFA]/40 text-xs">Нет данных за период</div>
          ) : (
            <div className="space-y-1">
              {dailyMetrics.slice(-14).map((point) => {
                const maxConv = Math.max(...dailyMetrics.map(p => p.conversions), 1)
                const height = (point.conversions / maxConv) * 100
                return (
                  <div key={point.date} className="flex items-center gap-3 text-xs">
                    <span className="text-[#FAFAFA]/40 w-24 shrink-0">{point.date}</span>
                    <div className="flex-1 h-4 rounded-full bg-[#1A0A10]/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#40E0D0] to-[#3498db]"
                        style={{ width: `${height}%` }}
                      />
                    </div>
                    <span className="text-[#FAFAFA]/60 w-16 text-right">{point.conversions}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Топ страницы + Источники трафика */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-sm font-semibold text-[#FAFAFA] mb-4">Топ страниц</h2>
          {topPages.length === 0 ? (
            <div className="text-center py-8 text-[#FAFAFA]/40 text-xs">Нет данных</div>
          ) : (
            <div className="space-y-3">
              {topPages.slice(0, 5).map((page, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#FAFAFA]/40 w-5">{i + 1}</span>
                    <span className="text-sm text-[#FAFAFA]">{page.path}</span>
                  </div>
                  <span className="text-sm text-[#FAFAFA]/70">{page.views} просмотров</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-sm font-semibold text-[#FAFAFA] mb-4">Источники трафика</h2>
          {trafficSources.length === 0 ? (
            <div className="text-center py-8 text-[#FAFAFA]/40 text-xs">Нет данных</div>
          ) : (
            <div className="space-y-4">
              {trafficSources.slice(0, 5).map((source, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#FAFAFA]">{source.source}</span>
                    <span className="text-[#FAFAFA]/60">{source.visitors} посетителей ({source.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#1A0A10]/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7E2FE0] to-[#3498db]"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Распределение по тарифам */}
      <div className="glass rounded-xl p-6 neon-border mb-8">
        <h2 className="text-sm font-semibold text-[#FAFAFA] mb-4">Распределение по тарифам</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { plan: "Starter", users: metrics.subscriptions, revenue: metrics.subscriptions * 9900, color: "#3498db" },
            { plan: "Pro", users: Math.round(metrics.subscriptions * 0.3), revenue: Math.round(metrics.subscriptions * 0.3 * 29900), color: "#7E2FE0" },
            { plan: "Enterprise", users: Math.round(metrics.subscriptions * 0.1), revenue: Math.round(metrics.subscriptions * 0.1 * 99000), color: "#D4AF37" },
          ].map((plan) => (
            <div key={plan.plan} className="glass rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-[#FAFAFA]">{plan.plan}</div>
              <div className="text-2xl font-bold mt-2" style={{ color: plan.color }}>{plan.users}</div>
              <div className="text-xs text-[#FAFAFA]/50 mt-1">пользователей</div>
              <div className="text-sm text-[#D4AF37] mt-2">{formatCurrency(plan.revenue)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Сводка */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-xl p-6 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">Всего проектов</div>
          <div className="text-3xl font-bold text-[#BA55D3]">{metrics.totalProjects}</div>
        </div>
        <div className="glass rounded-xl p-6 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">Активных проектов</div>
          <div className="text-3xl font-bold shimmer-text">{metrics.activeProjects}</div>
        </div>
        <div className="glass rounded-xl p-6 neon-border text-center">
          <div className="text-xs text-[#FAFAFA]/50 mb-1">Просмотров (30 дней)</div>
          <div className="text-3xl font-bold text-[#D4AF37]">{metrics.pageViews.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}