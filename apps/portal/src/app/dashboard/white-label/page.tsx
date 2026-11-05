"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface WhiteLabelData {
  hasLicense: boolean
  license: {
    id: string
    brandName: string
    customDomain: string | null
    licenseFee: number
    royaltyRate: number
    slaTier: string
    dedicatedServers: boolean
    auditSecurity: boolean
    isActive: boolean
    activatedAt: string
    expiresAt: string | null
  } | null
}

const SLA_TIERS = [
  { id: "standard", name: "Standard", price: 299000, desc: "Базовая лицензия, стандартный SLA" },
  { id: "premium", name: "Premium", price: 599000, desc: "Выделенные серверы, расширенный SLA" },
  { id: "enterprise", name: "Enterprise", price: 1499000, desc: "Полный аудит безопасности, SLA 99.9%" },
]

export default function WhiteLabelPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<WhiteLabelData | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      try {
        const response = await fetch("/api/white-label/stats")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Load white-label data error:", error)
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

  const license = data?.license

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
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2">White-Label лицензия</h1>
        <p className="text-sm text-[#FAFAFA]/50 mb-8">
          Запустите собственную копию StartTechPro под своим брендом
        </p>

        {license ? (
          <>
            {/* Текущая лицензия */}
            <div className="glass rounded-xl p-6 neon-border mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-[#FAFAFA]/70">Ваш бренд</div>
                  <div className="text-2xl font-bold shimmer-text mt-1">{license.brandName}</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-[#40E0D0]/20 text-[#40E0D0]">
                  {license.isActive ? "Активна" : "Неактивна"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-xs text-[#FAFAFA]/50">Уровень SLA</div>
                  <div className="text-sm font-bold text-[#FAFAFA] mt-1">{license.slaTier.toUpperCase()}</div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-xs text-[#FAFAFA]/50">Роялти</div>
                  <div className="text-sm font-bold text-[#D4AF37] mt-1">{license.royaltyRate}% от выручки</div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-xs text-[#FAFAFA]/50">Домен</div>
                  <div className="text-sm font-bold text-[#FAFAFA] mt-1">{license.customDomain || "Не указан"}</div>
                </div>
              </div>

              <div className="flex gap-4">
                {license.dedicatedServers && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#7E2FE0]/20 text-[#7E2FE0]">Выделенные серверы</span>
                )}
                {license.auditSecurity && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#3498db]/20 text-[#3498db]">Аудит безопасности</span>
                )}
              </div>

              {license.expiresAt && (
                <div className="text-xs text-[#FAFAFA]/40 mt-4">
                  Действует до: {new Date(license.expiresAt).toLocaleDateString("ru-RU")}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Тарифы White-Label */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {SLA_TIERS.map((tier) => (
                <div key={tier.id} className={`glass rounded-xl p-6 neon-border flex flex-col ${tier.id === "premium" ? "ring-2 ring-[#D4AF37]" : ""}`}>
                  {tier.id === "premium" && (
                    <div className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold mb-2 text-center">Рекомендуем</div>
                  )}
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-[#FAFAFA]">{tier.name}</div>
                    <div className="text-2xl font-bold shimmer-text mt-2">{(tier.price / 100).toLocaleString("ru-RU")} ₽</div>
                    <div className="text-xs text-[#FAFAFA]/50">единовременно</div>
                  </div>
                  <div className="text-xs text-[#FAFAFA]/60 text-center mb-4 flex-1">{tier.desc}</div>
                  <ul className="space-y-2 mb-6">
                    <li className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                      <span className="text-[#40E0D0]">✓</span> Свой бренд и домен
                    </li>
                    <li className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                      <span className="text-[#40E0D0]">✓</span> Полный функционал платформы
                    </li>
                    <li className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                      <span className="text-[#40E0D0]">✓</span> Роялти {tier.id === "standard" ? "20" : tier.id === "premium" ? "18" : "15"}%
                    </li>
                    {tier.id !== "standard" && (
                      <li className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                        <span className="text-[#40E0D0]">✓</span> {tier.id === "premium" ? "Выделенные серверы" : "Выделенные серверы + аудит"}
                      </li>
                    )}
                  </ul>
                  <button className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full">
                    Приобрести лицензию
                  </button>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-6 neon-border">
              <h2 className="text-lg font-bold text-[#FAFAFA] mb-4">Что входит в White-Label лицензию</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-sm font-bold text-[#FAFAFA] mb-1">🎨 Полный брендинг</div>
                  <div className="text-xs text-[#FAFAFA]/50">Ваш логотип, цвета, домен — платформа полностью под вашим брендом</div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-sm font-bold text-[#FAFAFA] mb-1">⚙️ Весь функционал</div>
                  <div className="text-xs text-[#FAFAFA]/50">AI-агенты, Prompt Studio, Live Editor, биллинг — всё как в StartTechPro</div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-sm font-bold text-[#FAFAFA] mb-1">🛡️ Безопасность</div>
                  <div className="text-xs text-[#FAFAFA]/50">RLS-изоляция, 152-ФЗ, аудит безопасности (в Premium/Enterprise)</div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                  <div className="text-sm font-bold text-[#FAFAFA] mb-1">💪 Поддержка</div>
                  <div className="text-xs text-[#FAFAFA]/50">Выделенная команда поддержки, SLA в зависимости от тарифа</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}