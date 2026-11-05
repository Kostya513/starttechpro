"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/", label: "Дашборд", icon: "📊" },
  { href: "/analytics", label: "Аналитика", icon: "📈" },
  { href: "/kanban", label: "Канбан", icon: "📋" },
  { href: "/orchestrator", label: "Оркестратор", icon: "🤖" },
  { href: "/audit-log", label: "Журнал", icon: "📝" },
  { href: "/users", label: "Пользователи", icon: "👥" },
  { href: "/settings", label: "Настройки", icon: "⚙️" },
]

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin")
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // Don't show sidebar on login page
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <aside className="w-56 glass-dark min-h-screen flex flex-col shrink-0">
        <div className="p-4 border-b border-[#7E2FE0]/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#1A0A10] flex items-center justify-center">
                <span className="text-xs font-bold shimmer-text">S</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#FAFAFA]">Internal</div>
              <div className="text-[10px] text-[#D4AF37]">Операционная зона</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "glass text-[#FAFAFA] neon-border"
                    : "text-[#FAFAFA]/60 hover:text-[#FAFAFA] hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#7E2FE0]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] flex items-center justify-center text-[10px] font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-[#FAFAFA]/60">{userName}</span>
            </div>
            <button onClick={handleLogout} className="text-xs text-[#FAFAFA]/30 hover:text-red-400 transition-colors" title="Выйти">
              ✕
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}