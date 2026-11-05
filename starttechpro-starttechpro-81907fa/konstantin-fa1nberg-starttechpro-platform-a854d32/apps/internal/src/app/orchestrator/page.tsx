"use client"

import { useEffect, useState } from "react"

interface AgentExecution {
  id: string
  agentName: string
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  startedAt: string | null
  completedAt: string | null
  durationSeconds: number | null
  tokensUsed: number
  cost: number
  createdAt: string
}

export default function OrchestratorPage() {
  const [executions, setExecutions] = useState<AgentExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExecutions = async () => {
      try {
        const res = await fetch("/api/admin/agents")
        if (res.ok) {
          const data = await res.json()
          setExecutions(data.executions || [])
        }
      } catch (error) {
        console.error("Orchestrator load error:", error)
      }
      setLoading(false)
    }
    loadExecutions()
  }, [])

  // Агрегируем по агентам
  const agentStats = new Map<string, { tasks: number; completed: number; failed: number; totalTokens: number; totalCost: number }>()
  for (const exec of executions) {
    const stats = agentStats.get(exec.agentName) || { tasks: 0, completed: 0, failed: 0, totalTokens: 0, totalCost: 0 }
    stats.tasks++
    if (exec.status === "completed") stats.completed++
    if (exec.status === "failed") stats.failed++
    stats.totalTokens += exec.tokensUsed || 0
    stats.totalCost += exec.cost || 0
    agentStats.set(exec.agentName, stats)
  }

  const agents = Array.from(agentStats.entries()).map(([name, stats]) => ({
    name,
    tasks: stats.tasks,
    completed: stats.completed,
    failed: stats.failed,
    accuracy: stats.tasks > 0 ? Math.round((stats.completed / stats.tasks) * 100) : 100,
    totalTokens: stats.totalTokens,
    totalCost: stats.totalCost,
  }))

  const statusLabels: Record<string, string> = {
    pending: "Ожидание",
    running: "Выполняется",
    completed: "Завершён",
    failed: "Ошибка",
    cancelled: "Отменён",
  }

  const statusColors: Record<string, string> = {
    pending: "text-[#3498db]",
    running: "text-[#D4AF37]",
    completed: "text-[#40E0D0]",
    failed: "text-red-400",
    cancelled: "text-[#FAFAFA]/40",
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка данных оркестратора...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#FAFAFA] mb-6">AI-оркестратор</h1>

      {/* Статус агентов */}
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Агенты</h2>
      {agents.length === 0 ? (
        <div className="glass rounded-xl p-8 neon-border text-center mb-8">
          <div className="text-4xl mb-3">🤖</div>
          <div className="text-sm text-[#FAFAFA]/60">Нет данных о выполнении агентов</div>
          <div className="text-xs text-[#FAFAFA]/40 mt-1">Данные появятся после запуска цепочек</div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-4 mb-8">
          {agents.map((agent) => (
            <div key={agent.name} className="glass rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${agent.failed > 0 ? "bg-red-400" : "bg-[#40E0D0]"} animate-pulse`} />
                  <span className="text-sm font-medium text-[#FAFAFA]">{agent.name}</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-[#FAFAFA]/60">
                <span>Задач: {agent.tasks}</span>
                <span>Точность: {agent.accuracy}%</span>
              </div>
              {agent.totalCost > 0 && (
                <div className="text-xs text-[#FAFAFA]/40 mt-1">
                  Затраты: {(agent.totalCost / 100).toFixed(2)} ₽
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Последние выполнения */}
      <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Последние выполнения</h2>
      {executions.length === 0 ? (
        <div className="glass rounded-xl p-8 neon-border text-center">
          <div className="text-sm text-[#FAFAFA]/60">История выполнений пуста</div>
        </div>
      ) : (
        <div className="glass rounded-xl neon-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7E2FE0]/20">
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Агент</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Статус</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Длительность</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Токены</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Стоимость</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {executions.slice(0, 20).map((exec) => (
                  <tr key={exec.id} className="border-b border-[#7E2FE0]/10 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#FAFAFA]">{exec.agentName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${statusColors[exec.status] || ""}`}>
                        {statusLabels[exec.status] || exec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">
                      {exec.durationSeconds ? `${exec.durationSeconds}с` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">
                      {exec.tokensUsed ? exec.tokensUsed.toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">
                      {exec.cost ? `${(exec.cost / 100).toFixed(2)} ₽` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/40">
                      {new Date(exec.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}