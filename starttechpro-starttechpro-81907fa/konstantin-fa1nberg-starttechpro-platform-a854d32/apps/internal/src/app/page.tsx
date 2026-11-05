"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function InternalDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        {[
          { label: "Активные проекты", value: "7", color: "text-[#D4AF37]" },
          { label: "AI-агенты в работе", value: "12", color: "text-[#3498db]" },
          { label: "Ожидают проверки", value: "3", color: "text-[#40E0D0]" },
          { label: "Завершено сегодня", value: "2", color: "text-[#BA55D3]" },
          { label: "Среднее время", value: "4.2ч", color: "text-[#D4AF37]" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 neon-border text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-[#1A0A10]/70 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban-доска */}
      <h2 className="text-xl font-bold text-[#FAFAFA] mb-4">Производство</h2>
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { title: "Ожидание", count: 2, color: "border-l-[#3498db]", items: ["GrowEasy — Исследование", "GreenPulse — Планирование"] },
          { title: "В работе", count: 3, color: "border-l-[#D4AF37]", items: ["SynergyMind — Разработка", "ConnectSphere — QA", "LearnSphere — Дизайн"] },
          { title: "На проверке", count: 2, color: "border-l-[#BA55D3]", items: ["Сайт клиента A — Финальное QA", "AI-агент B — Тестирование"] },
          { title: "Готово", count: 1, color: "border-l-[#40E0D0]", items: ["Лендинг C — Запущен"] },
        ].map((col) => (
          <div key={col.title} className="glass rounded-xl p-4 neon-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#FAFAFA]">{col.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full glass-dark text-[#D4AF37]">{col.count}</span>
            </div>
            <div className="space-y-2">
              {col.items.map((item) => (
                <div key={item} className={`glass rounded-lg p-3 text-xs text-[#1A0A10]/80 border-l-2 ${col.color}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI-оркестратор */}
      <h2 className="text-xl font-bold text-[#FAFAFA] mb-4">AI-оркестратор</h2>
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Цепочки агентов</h3>
          <div className="space-y-3">
            {[
              { name: "Создание сайта", agents: "Аналитик → Архитектор → Дизайнер → Разработчик → QA → Публикатор", status: "Активна" },
              { name: "AI-агент поддержки", agents: "Аналитик → Разработчик → QA → Публикатор", status: "Активна" },
              { name: "B2B-платформа", agents: "Аналитик → Архитектор → Дизайнер → Разработчик → QA → Публикатор", status: "Черновик" },
            ].map((chain) => (
              <div key={chain.name} className="glass rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#FAFAFA]">{chain.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${chain.status === "Активна" ? "bg-[#40E0D0]/20 text-[#40E0D0]" : "glass-dark text-[#D4AF37]"}`}>
                    {chain.status}
                  </span>
                </div>
                <div className="text-xs text-[#FAFAFA]/50">{chain.agents}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Библиотека агентов</h3>
          <div className="space-y-3">
            {[
              { name: "Аналитик", model: "GPT-4o", status: "Online" },
              { name: "Архитектор", model: "Claude 3.5", status: "Online" },
              { name: "Дизайнер", model: "GPT-4o", status: "Online" },
              { name: "Разработчик", model: "Claude 3.5", status: "Online" },
              { name: "QA", model: "GPT-4o", status: "Online" },
              { name: "Публикатор", model: "GPT-4o-mini", status: "Online" },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#40E0D0] animate-pulse" />
                  <span className="text-sm text-[#FAFAFA]">{agent.name}</span>
                </div>
                <span className="text-xs text-[#FAFAFA]/50">{agent.model}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <h2 className="text-xl font-bold text-[#FAFAFA] mb-4">Журнал действий</h2>
      <div className="glass rounded-xl p-6 neon-border">
        <div className="space-y-2">
          {[
            { time: "14:32", user: "Admin", action: "Запущена цепочка SynergyMind", type: "info" },
            { time: "14:15", user: "System", action: "AI-агент Дизайнер завершил работу над ConnectSphere", type: "success" },
            { time: "13:50", user: "Admin", action: "Изменён промпт агента Аналитик", type: "warning" },
            { time: "13:22", user: "System", action: 'Новый пользователь зарегистрирован: ООО "ТехноПрогресс"', type: "info" },
            { time: "12:45", user: "Admin", action: "Оплата тарифа Pro: 150 000 ₽", type: "success" },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-[#7E2FE0]/10 last:border-0">
              <span className="text-xs text-[#FAFAFA]/40 w-12">{log.time}</span>
              <span className="text-xs text-[#FAFAFA]/60 w-16">{log.user}</span>
              <span className={`text-xs ${
                log.type === "success" ? "text-[#40E0D0]" : 
                log.type === "warning" ? "text-[#D4AF37]" : 
                "text-[#FAFAFA]/70"
              }`}>{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}