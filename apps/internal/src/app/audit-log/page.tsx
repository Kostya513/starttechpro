"use client"

import { useEffect, useState } from "react"

interface AuditLog {
  id: string
  userId: string | null
  action: string
  resourceType: string
  resourceId: string | null
  details: Record<string, unknown>
  createdAt: string
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetch("/api/admin/audit-logs")
        if (res.ok) {
          const data = await res.json()
          setLogs(data.logs || [])
        }
      } catch (error) {
        console.error("Audit log load error:", error)
      }
      setLoading(false)
    }
    loadLogs()
  }, [])

  const actionLabels: Record<string, string> = {
    create: "Создание",
    update: "Изменение",
    delete: "Удаление",
    login: "Вход",
    logout: "Выход",
    payment: "Платёж",
    subscription_change: "Изменение тарифа",
    project_create: "Создание проекта",
    project_delete: "Удаление проекта",
    settings_change: "Изменение настроек",
    api_call: "API-вызов",
  }

  const actionColors: Record<string, string> = {
    create: "text-[#40E0D0]",
    update: "text-[#3498db]",
    delete: "text-red-400",
    login: "text-[#40E0D0]",
    logout: "text-[#FAFAFA]/60",
    payment: "text-[#D4AF37]",
    subscription_change: "text-[#D4AF37]",
    project_create: "text-[#7E2FE0]",
    project_delete: "text-red-400",
    settings_change: "text-[#3498db]",
    api_call: "text-[#BA55D3]",
  }

  const resourceLabels: Record<string, string> = {
    project: "Проект",
    user: "Пользователь",
    subscription: "Подписка",
    payment: "Платёж",
    task: "Задача",
    agent: "Агент",
    settings: "Настройки",
    api: "API",
  }

  const resourceColors: Record<string, string> = {
    project: "bg-[#7E2FE0]/20 text-[#7E2FE0]",
    user: "bg-[#3498db]/20 text-[#3498db]",
    subscription: "bg-[#D4AF37]/20 text-[#D4AF37]",
    payment: "bg-[#D4AF37]/20 text-[#D4AF37]",
    task: "bg-[#BA55D3]/20 text-[#BA55D3]",
    agent: "bg-[#40E0D0]/20 text-[#40E0D0]",
    settings: "bg-[#3498db]/20 text-[#3498db]",
    api: "bg-[#BA55D3]/20 text-[#BA55D3]",
  }

  const filteredLogs = filter
    ? logs.filter((l) => l.resourceType === filter || l.action === filter)
    : logs

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка журнала действий...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Журнал действий</h1>
        <div className="flex gap-2">
          <select
            className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Все категории</option>
            <option value="project">Проект</option>
            <option value="user">Пользователь</option>
            <option value="payment">Платёж</option>
            <option value="subscription">Подписка</option>
            <option value="task">Задача</option>
            <option value="agent">Агент</option>
            <option value="settings">Нас��ройки</option>
          </select>
          <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA] hover:bg-white/[0.04] transition-all">
            Экспорт
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="glass rounded-xl p-10 neon-border text-center">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm text-[#FAFAFA]/60">Журнал действий пуст</div>
          <div className="text-xs text-[#FAFAFA]/40 mt-1">Записи появятся по мере использования платформы</div>
        </div>
      ) : (
        <div className="glass rounded-xl neon-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7E2FE0]/20">
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Время</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Категория</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Действие</th>
                  <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Ресурс</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="border-b border-[#7E2FE0]/10 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/40 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${resourceColors[log.resourceType] || "bg-[#7E2FE0]/20 text-[#7E2FE0]"}`}>
                        {resourceLabels[log.resourceType] || log.resourceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${actionColors[log.action] || "text-[#FAFAFA]/70"}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/60">
                      {log.resourceId ? log.resourceId.slice(0, 12) + "..." : "—"}
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