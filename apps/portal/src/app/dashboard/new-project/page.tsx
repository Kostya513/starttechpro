"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

const projectTypes = [
  { id: "website", name: "Сайт", desc: "Лендинг, корпоративный сайт, блог", icon: "🌐" },
  { id: "platform", name: "Платформа", desc: "Маркетплейс, SaaS, CRM", icon: "⚙️" },
  { id: "ai-agent", name: "AI-агент", desc: "Чат-бот, ассистент, анализатор", icon: "🤖" },
  { id: "telegram-bot", name: "Telegram-бот", desc: "Бот для бизнеса и автоматизации", icon: "📱" },
  { id: "mobile", name: "Мобильное приложение", desc: "iOS / Android приложение", icon: "📲" },
  { id: "other", name: "Другое", desc: "Индивидуальный проект", icon: "💡" },
]

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [acceptedContent, setAcceptedContent] = useState(false)
  const [balanceInfo, setBalanceInfo] = useState<{
    balance: number
    estimatedCost: number
    sufficient: boolean
  } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      
      // Загружаем баланс
      try {
        const response = await fetch("/api/wallet/balance")
        if (response.ok) {
          const data = await response.json()
          setBalanceInfo({
            balance: data.balance,
            estimatedCost: 138900, // 890 (домен) + 499 (хостинг) = 1 389 ₽
            sufficient: data.balance >= 138900,
          })
        }
      } catch {
        // Игнорируем ошибку загрузки баланса
      }

      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedContent) {
      setError("Необходимо принять ответственность за размещаемый контент")
      return
    }

    setCreating(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      // Создаём проект через API
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          projectName: name,
          projectType: selectedType,
          description,
          customDomain: customDomain || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.redirectToBilling) {
          // Недостаточно средств — перенаправляем на пополнение
          router.push("/dashboard/billing?insufficient=true")
          return
        }
        setError(result.error || "Ошибка создания проекта")
        setCreating(false)
        return
      }

      // Успех — переходим в дашборд
      router.push("/dashboard?project_created=true")
    } catch {
      setError("Ошибка соединения")
      setCreating(false)
    }
  }

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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-[#FAFAFA] mb-8">Новый проект</h1>

        {/* Прогресс */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                s <= step ? "bg-gradient-to-br from-[#7E2FE0] to-[#3498db] text-white neon-border" : "glass text-[#FAFAFA]/40"
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${s < step ? "bg-[#7E2FE0]" : "bg-[#FAFAFA]/10"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-[#FAFAFA] mb-2">Тип проекта</h2>
            <p className="text-sm text-[#FAFAFA]/60 mb-6">Выберите, что вы хотите создать</p>
            <div className="grid gap-4 md:grid-cols-3">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setStep(2) }}
                  className={`glass rounded-xl p-6 neon-border text-left transition-all hover:bg-white/[0.04] ${
                    selectedType === type.id ? "ring-2 ring-[#D4AF37]" : ""
                  }`}
                >
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <div className="text-sm font-semibold text-[#FAFAFA]">{type.name}</div>
                  <div className="text-xs text-[#FAFAFA]/50 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-[#FAFAFA] mb-2">Название и описание</h2>
            <p className="text-sm text-[#FAFAFA]/60 mb-6">Опишите ваш проект — AI-агенты помогут с деталями</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(3) }} className="flex flex-col gap-5 max-w-xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Название проекта</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Мой интернет-магазин"
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Описание</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Опишите идею, целевую аудиторию, ключевые функции..."
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">
                  Назад
                </button>
                <button type="submit" className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
                  Далее
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-[#FAFAFA] mb-2">Домен</h2>
            <p className="text-sm text-[#FAFAFA]/60 mb-6">Вы получите поддомен starttechpro.ru. Можно привязать свой домен.</p>
            <div className="max-w-xl flex flex-col gap-5">
              <div className="glass rounded-xl p-6 neon-border">
                <div className="text-sm text-[#FAFAFA]/70 mb-2">Ваш поддомен</div>
                <div className="text-lg font-bold shimmer-text">
                  {name ? `${name.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.starttechpro.ru` : "название.starttechpro.ru"}
                </div>
                <div className="text-xs text-[#FAFAFA]/40 mt-1">Бесплатно, SSL включён</div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-[#FAFAFA]/70">Свой домен (опционально)</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="example.ru"
                  className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                />
                <div className="text-xs text-[#FAFAFA]/40">
                  Настройте CNAME-запись на вашем DNS-хостинге. Мы поможем с настройкой.
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">
                  Назад
                </button>
                <button onClick={() => setStep(4)} className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
                  Далее
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-[#FAFAFA] mb-2">Подтверждение и оплата</h2>
            <p className="text-sm text-[#FAFAFA]/60 mb-6">Проверьте данные перед запуском</p>
            <div className="glass rounded-xl p-8 neon-border max-w-xl">
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-[#FAFAFA]/50">Тип проекта</div>
                  <div className="text-sm text-[#FAFAFA] font-medium">{projectTypes.find(t => t.id === selectedType)?.name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#FAFAFA]/50">Название</div>
                  <div className="text-sm text-[#FAFAFA] font-medium">{name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#FAFAFA]/50">Описание</div>
                  <div className="text-sm text-[#FAFAFA]/70">{description}</div>
                </div>
                <div>
                  <div className="text-xs text-[#FAFAFA]/50">Домен</div>
                  <div className="text-sm text-[#FAFAFA] font-medium">
                    {name.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.starttechpro.ru
                    {customDomain && <span className="text-[#FAFAFA]/50"> + {customDomain}</span>}
                  </div>
                </div>
              </div>

              {/* Детализация стоимости */}
              <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10 mb-6">
                <div className="text-sm font-bold text-[#FAFAFA] mb-3">Стоимость публикации</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#FAFAFA]/50">Домен .starttechpro.ru (на год)</span>
                    <span className="text-[#FAFAFA]/70">890 ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FAFAFA]/50">Хостинг (на месяц)</span>
                    <span className="text-[#FAFAFA]/70">499 ₽</span>
                  </div>
                  <div className="border-t border-[#7E2FE0]/10 pt-2 flex justify-between">
                    <span className="text-[#FAFAFA] font-bold">Итого к списанию</span>
                    <span className="text-[#D4AF37] font-bold">1 389 ₽</span>
                  </div>
                </div>
              </div>

              {/* Баланс */}
              <div className="flex justify-between items-center mb-6 p-3 rounded-lg bg-[#1A0A10] border border-[#7E2FE0]/10">
                <span className="text-xs text-[#FAFAFA]/70">Баланс кошелька</span>
                <span className={`text-sm font-bold ${balanceInfo?.sufficient ? "text-[#40E0D0]" : "text-red-400"}`}>
                  {balanceInfo ? `${(balanceInfo.balance / 100).toLocaleString("ru-RU")} ₽` : "Загрузка..."}
                </span>
              </div>

              {balanceInfo && !balanceInfo.sufficient && (
                <div className="mb-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="text-xs text-yellow-400">
                    ⚠️ Недостаточно средств. Пополните кошелёк минимум на {(138900 - balanceInfo.balance) / 100} ₽
                  </div>
                </div>
              )}

              {/* Чекбокс: ответственность за контент */}
              <label className="flex items-start gap-3 text-sm text-[#FAFAFA]/70 mb-4">
                <input
                  type="checkbox"
                  checked={acceptedContent}
                  onChange={(e) => setAcceptedContent(e.target.checked)}
                  required
                  className="mt-0.5 shrink-0"
                />
                <span>
                  Я принимаю{' '}
                  <a href="/legal/offer.md" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                    ответственность за размещаемый контент
                  </a>
                  {' '}в соответствии с Публичной офертой (раздел 9)
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(3)} className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">
                  Назад
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || (balanceInfo ? !balanceInfo.sufficient : false) || !acceptedContent}
                  className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 disabled:opacity-50 flex-1"
                >
                  {creating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Создание проекта...
                    </span>
                  ) : balanceInfo && !balanceInfo.sufficient ? (
                    <Link href="/dashboard/billing" className="block">
                      Пополнить кошелёк
                    </Link>
                  ) : (
                    "Запустить проект"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}