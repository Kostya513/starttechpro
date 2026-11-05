"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface Project {
  id: string
  name: string
  type: string
  description: string
  status: string
  subdomain: string | null
  deploymentUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)

      // Загружаем баланс
      try {
        const balanceResponse = await fetch("/api/wallet/balance")
        if (balanceResponse.ok) {
          const data = await balanceResponse.json()
          setWalletBalance(data.balance)
        }
      } catch {
        // Игнорируем
      }

      // Загружаем проекты
      try {
        const projectsResponse = await fetch("/api/projects/list")
        if (projectsResponse.ok) {
          const data = await projectsResponse.json()
          setProjects(data.projects || [])
        }
      } catch {
        // Игнорируем
      }

      setLoading(false)
    }
    getUser()
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

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Пользователь"
  const initials = userName.charAt(0).toUpperCase()

  const activeProjects = projects.filter((p) => p.status === "active")
  const provisioningProjects = projects.filter((p) => p.status === "provisioning")
  const archivedProjects = projects.filter((p) => p.status === "archived" || p.status === "suspended")

  const statusLabels: Record<string, string> = {
    active: "Активен",
    provisioning: "Развёртывание",
    suspended: "Приостановлен",
    archived: "Архив",
    failed: "Ошибка",
  }

  const statusColors: Record<string, string> = {
    active: "text-[#40E0D0]",
    provisioning: "text-[#3498db]",
    suspended: "text-yellow-400",
    archived: "text-[#FAFAFA]/40",
    failed: "text-red-400",
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#1A0A10] flex items-center justify-center">
                    <span className="text-lg font-bold shimmer-text">S</span>
                  </div>
                </div>
              </div>
              <div className="font-bold text-lg mx-2">
                <span className="text-lg font-bold shimmer-text">S</span>
                <span className="text-[#D4AF37]">tart</span>
                <span className="text-lg font-bold shimmer-text">T</span>
                <span className="text-[#D4AF37]">ech</span>
                <span className="text-lg font-bold shimmer-text">P</span>
                <span className="text-[#D4AF37]">ro</span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/notifications"
              className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors"
              title="Уведомления"
            >
              🔔
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors"
            >
              Настройки
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-[#FAFAFA]/50 hover:text-red-400 transition-colors"
            >
              Выйти
            </button>
            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] flex items-center justify-center text-sm font-bold text-white"
            >
              {initials}
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Приветствие */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#FAFAFA]">
            Добро пожаловать,{" "}
            <span className="shimmer-text">{userName}</span>
          </h1>
          <p className="text-[#FAFAFA]/70 mt-2">
            {user?.email} — Управляйте своими проектами и следите за прогрессом
          </p>
        </div>

        {/* Виджеты статуса */}
        <div className="grid gap-6 md:grid-cols-4 mb-10">
          {[
            { label: "Активные проекты", value: String(activeProjects.length), color: "text-[#D4AF37]" },
            { label: "Развёртывание", value: String(provisioningProjects.length), color: "text-[#3498db]" },
            { label: "Завершено", value: String(archivedProjects.length), color: "text-[#40E0D0]" },
            { label: "Баланс", value: walletBalance !== null ? `${(walletBalance / 100).toLocaleString("ru-RU")} ₽` : "—", color: "text-[#D4AF37]" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 neon-border text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[#FAFAFA]/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Проекты */}
        <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6">Мои проекты</h2>
        {projects.length === 0 ? (
          <div className="glass rounded-xl p-10 neon-border text-center">
            <div className="text-4xl mb-4">🚀</div>
            <div className="text-lg font-semibold text-[#FAFAFA] mb-2">У вас пока нет проектов</div>
            <p className="text-sm text-[#FAFAFA]/60 mb-6">Создайте первый проект с помощью AI-агентов</p>
            <Link
              href="/dashboard/new-project"
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 inline-block"
            >
              Создать проект
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="glass rounded-xl p-6 neon-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#FAFAFA]">{project.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full glass-dark ${statusColors[project.status] || "text-[#FAFAFA]/70"}`}>
                        {statusLabels[project.status] || project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#FAFAFA]/70">
                      {project.subdomain && <span>🔗 {project.subdomain}</span>}
                      <span>📅 {new Date(project.createdAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Link
                      href={project.status === "active" ? "/dashboard/live-editor" : "#"}
                      className={`gradient-neon rounded-lg px-4 py-1.5 text-xs font-bold text-white neon-border transition-all inline-block mt-1 ${
                        project.status !== "active" ? "opacity-50 pointer-events-none" : "hover:opacity-90"
                      }`}
                    >
                      {project.status === "active" ? "Открыть" : project.status === "provisioning" ? "Развёртывается..." : "Архив"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Быстрые действия */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-6">Быстрые действия</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/dashboard/new-project" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Новый проект</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Запустите новый проект с AI-агентами</div>
            </Link>
            <Link href="/dashboard/live-editor" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">✏️</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Live Editor</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Редактируйте проект через чат с AI</div>
            </Link>
            <Link href="/dashboard/billing" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Тарифы и оплата</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Изменить тариф или пополнить баланс</div>
            </Link>
            <Link href="/dashboard/partner" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">🤝</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Партнёрская программа</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Привлекайте клиентов и зарабатывайте 20%</div>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4 mt-4">
            <Link href="/dashboard/investor" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Инвестиции</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Управляйте инвестициями и доходностью</div>
            </Link>
            <Link href="/dashboard/white-label" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">White-Label</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Запустите платформу под своим брендом</div>
            </Link>
            <Link href="/dashboard/support" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Поддержка</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Связаться с командой</div>
            </Link>
            <Link href="/dashboard/notifications" className="glass rounded-xl p-6 neon-border text-center hover:bg-white/[0.04] transition-all">
              <div className="text-3xl mb-2">🔔</div>
              <div className="text-sm font-semibold text-[#FAFAFA]">Уведомления</div>
              <div className="text-xs text-[#FAFAFA]/70 mt-1">Настройка оповещений</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}