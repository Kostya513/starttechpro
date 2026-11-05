"use client"

import { useEffect, useState } from "react"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "done" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("/api/admin/tasks")
        if (res.ok) {
          const data = await res.json()
          setTasks(data.tasks || [])
        }
      } catch (error) {
        console.error("Kanban load error:", error)
      }
      setLoading(false)
    }
    loadTasks()
  }, [])

  const columns = [
    { title: "Ожидание", status: "todo" as const, color: "border-l-[#3498db]" },
    { title: "В работе", status: "in_progress" as const, color: "border-l-[#D4AF37]" },
    { title: "На проверке", status: "review" as const, color: "border-l-[#BA55D3]" },
    { title: "Готово", status: "done" as const, color: "border-l-[#40E0D0]" },
  ]

  const priorityLabels: Record<string, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    critical: "Критичный",
  }

  const priorityColors: Record<string, string> = {
    low: "bg-[#3498db]/20 text-[#3498db]",
    medium: "bg-[#D4AF37]/20 text-[#D4AF37]",
    high: "bg-red-500/20 text-red-400",
    critical: "bg-red-500/40 text-red-300",
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка задач...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Канбан-доска</h1>
        <button className="gradient-neon rounded-lg px-4 py-2 text-xs font-bold text-white neon-border transition-all hover:opacity-90">
          + Новая задача
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status)
          return (
            <div key={col.title} className="glass rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">{col.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full glass-dark text-[#D4AF37]">{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-6 text-[#FAFAFA]/30 text-xs">Нет задач</div>
                ) : (
                  columnTasks.map((task) => (
                    <div key={task.id} className={`glass rounded-lg p-3 border-l-2 ${col.color}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#FAFAFA]">{task.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[task.priority] || ""}`}>
                          {priorityLabels[task.priority] || task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <div className="text-xs text-[#FAFAFA]/50">{task.description}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}