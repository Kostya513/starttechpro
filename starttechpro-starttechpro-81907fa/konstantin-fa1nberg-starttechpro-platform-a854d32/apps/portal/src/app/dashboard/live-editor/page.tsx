"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
}

interface Version {
  id: string
  versionNumber: number
  title: string
  description: string
  author: string
  status: "draft" | "preview" | "approved" | "merged" | "rolled_back" | "rejected"
  createdAt: string
}

export default function LiveEditorPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Привет! Я — AI-редактор вашего проекта. Опишите, что вы хотите изменить, и я предложу варианты. Например:\n\n• «Добавь секцию с отзывами на главную»\n• «Смени цветовую схему на более тёмную»\n• «Добавь форму подписки в футер»\n• «Оптимизируй скорость загрузки»",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [versions, setVersions] = useState<Version[]>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "versions" | "preview">("chat")
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("Проект")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUser(user)

      // Загружаем первый активный проект (или используем ID из URL)
      const params = new URLSearchParams(window.location.search)
      const pid = params.get("projectId")

      if (pid) {
        setProjectId(pid)
        const res = await fetch(`/api/projects/${pid}`)
        if (res.ok) {
          const data = await res.json()
          setProjectName(data.name)
        }
      } else {
        // Берём первый активный проект
        const res = await fetch("/api/projects/list")
        if (res.ok) {
          const data = await res.json()
          const active = data.projects?.find((p: { status: string }) => p.status === "active")
          if (active) {
            setProjectId(active.id)
            setProjectName(active.name)
          }
        }
      }

      setLoading(false)
    }
    init()
  }, [supabase, router])

  // Загружаем версии при переключении на вкладку
  useEffect(() => {
    if (activeTab === "versions" && projectId) {
      loadVersions()
    }
  }, [activeTab, projectId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadVersions = async () => {
    if (!projectId) return
    setVersionsLoading(true)
    try {
      const res = await fetch(`/api/live-editor/versions?projectId=${projectId}`)
      if (res.ok) {
        const data = await res.json()
        setVersions(data.versions || [])
      }
    } catch {
      // Игнорируем
    }
    setVersionsLoading(false)
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing || !user) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Отправляем запрос к AI через API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          projectId,
        }),
      })

      let responseContent: string

      if (response.ok) {
        const data = await response.json()
        responseContent = data.content
      } else {
        // Fallback: если AI API не настроен, используем заглушку
        const fallbackResponses: Record<string, string> = {
          "добавь": "✅ Отличная идея! Я подготовил изменения. Вот что я предлагаю:\n\n**Изменения:**\n• Добавлен новый блок с контентом\n• Адаптивная вёрстка под все устройства\n• SEO-оптимизация\n\nНажмите «Предпросмотр», чтобы увидеть результат.",
          "смени": "🎨 Я подобрал новую цветовую схему. Вот что изменится:\n\n• Основной цвет: #7E2FE0 → #6B21A8\n• Акцентный: #D4AF37 → #F59E0B\n• Фон: #1A0A10 → #0F0A1A\n\nХотите посмотреть в предпросмотре?",
          "оптимизируй": "⚡ Я проанализировал производительн��сть. Вот план оптимизации:\n\n1. WebP-формат для изображений (-40% веса)\n2. Lazy loading для всех секций\n3. Минификация CSS/JS\n4. Кэширование API-запросов\n\nОжидаемый прирост скорости: +35%",
        }

        responseContent = "Я понял ваш запрос! Давайте подумаем над лучшим решением. Не могли бы вы уточнить детали?"
        for (const [key, value] of Object.entries(fallbackResponses)) {
          if (userMessage.content.toLowerCase().includes(key)) {
            responseContent = value
            break
          }
        }
      }

      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: "system",
        content: "⚠️ Произошла ошибка при обработке запроса. Попробуйте ещё раз.",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsProcessing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const statusLabels: Record<string, string> = {
    draft: "Черновик",
    preview: "На проверке",
    approved: "Утверждён",
    merged: "В production",
    rolled_back: "Откат",
    rejected: "Отклонён",
  }

  const statusColors: Record<string, string> = {
    draft: "bg-[#3498db]/20 text-[#3498db]",
    preview: "bg-[#D4AF37]/20 text-[#D4AF37]",
    approved: "bg-[#40E0D0]/20 text-[#40E0D0]",
    merged: "bg-[#40E0D0]/20 text-[#40E0D0]",
    rolled_back: "bg-red-500/20 text-red-400",
    rejected: "bg-red-500/20 text-red-400",
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
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#FAFAFA]/50">{projectName}</span>
            <button onClick={handleLogout} className="text-sm text-[#FAFAFA]/50 hover:text-red-400 transition-colors">Выйти</button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#FAFAFA]">Live Editor</h1>
            <p className="text-sm text-[#FAFAFA]/50 mt-1">Редактируйте проект через диалог с AI</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "chat" ? "gradient-neon text-white neon-border" : "glass text-[#FAFAFA]/70 hover:text-[#FAFAFA]"
              }`}
            >
              💬 Чат
            </button>
            <button
              onClick={() => setActiveTab("versions")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "versions" ? "gradient-neon text-white neon-border" : "glass text-[#FAFAFA]/70 hover:text-[#FAFAFA]"
              }`}
            >
              📋 Версии ({versions.length})
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "preview" ? "gradient-neon text-white neon-border" : "glass text-[#FAFAFA]/70 hover:text-[#FAFAFA]"
              }`}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Чат / Версии / Preview */}
          <div className="md:col-span-2">
            {activeTab === "chat" && (
              <div className="glass rounded-xl neon-border flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl p-4 ${
                        msg.role === "user"
                          ? "gradient-neon text-white"
                          : msg.role === "system"
                          ? "glass-dark text-[#D4AF37]"
                          : "glass text-[#FAFAFA]"
                      }`}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                        <div className="text-[10px] text-right mt-2 opacity-50">
                          {new Date(msg.timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="glass rounded-xl p-4">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#7E2FE0] animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-[#7E2FE0] animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <span className="w-2 h-2 rounded-full bg-[#7E2FE0] animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-[#7E2FE0]/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Опишите, что хотите изменить..."
                      className="flex-1 glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isProcessing}
                      className="gradient-neon rounded-xl px-4 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "versions" && (
              <div className="glass rounded-xl neon-border p-6">
                <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">История версий</h2>
                {versionsLoading ? (
                  <div className="text-center py-10 text-[#FAFAFA]/50 text-sm animate-pulse">Загрузка версий...</div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">📝</div>
                    <div className="text-sm text-[#FAFAFA]/60">История версий пуста</div>
                    <div className="text-xs text-[#FAFAFA]/40 mt-1">Версии создаются автоматически при изменениях через чат</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versions.map((version, i) => (
                      <div key={version.id} className="glass rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] flex items-center justify-center text-xs font-bold text-white">
                              {version.versionNumber}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#FAFAFA]">{version.title}</div>
                              <div className="text-xs text-[#FAFAFA]/40">
                                {new Date(version.createdAt).toLocaleDateString("ru-RU")} — {version.author === "user" ? "Пользователь" : version.author === "ai-agent" ? "AI-агент" : "Система"}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[version.status] || ""}`}>
                            {statusLabels[version.status] || version.status}
                          </span>
                        </div>
                        {version.description && (
                          <p className="text-xs text-[#FAFAFA]/60 mb-3">{version.description}</p>
                        )}
                        <div className="flex gap-2">
                          {version.status === "preview" && (
                            <>
                              <button className="gradient-neon rounded-lg px-3 py-1.5 text-xs font-bold text-white neon-border transition-all hover:opacity-90">
                                ✅ Утвердить
                              </button>
                              <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all">
                                🔄 Откатить
                              </button>
                            </>
                          )}
                          {(version.status === "merged" || version.status === "approved") && (
                            <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all">
                              🔄 Откатить к этой версии
                            </button>
                          )}
                          <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all">
                            👁️ Смотреть diff
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "preview" && (
              <div className="glass rounded-xl neon-border p-6 text-center">
                <div className="text-5xl mb-4">👁️</div>
                <h2 className="text-lg font-semibold text-[#FAFAFA] mb-2">Предпросмотр изменений</h2>
                <p className="text-sm text-[#FAFAFA]/60 mb-6">
                  Разверните preview-версию, чтобы увидеть изменения перед публикацией
                </p>
                <button className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
                  🚀 Развернуть preview
                </button>
                <div className="mt-6 glass rounded-lg p-4 text-left">
                  <div className="text-xs text-[#FAFAFA]/50 mb-2">Последний preview:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#FAFAFA]">preview-a1b2c3.starttechpro.ru</span>
                    <span className="text-xs text-[#40E0D0]">Активен (ещё 23ч)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Боковая панель */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-6 neon-border">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-3">Текущий проект</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#FAFAFA]/50">Название</span>
                  <span className="text-[#FAFAFA]">{projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAFAFA]/50">Статус</span>
                  <span className="text-[#40E0D0]">Активен</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAFAFA]/50">Версий</span>
                  <span className="text-[#FAFAFA]">{versions.length}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 neon-border">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-3">A/B тесты</h3>
              <div className="space-y-3">
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#FAFAFA]">Главная — Hero</span>
                    <span className="text-[10px] text-[#40E0D0]">Активен</span>
                  </div>
                  <div className="text-[10px] text-[#FAFAFA]/50">
                    Вариант B: +1.6% конверсии
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#FAFAFA]">Цветовая схема</span>
                    <span className="text-[10px] text-[#D4AF37]">Завершён</span>
                  </div>
                  <div className="text-[10px] text-[#FAFAFA]/50">
                    Победитель: Тёмная тема (+4.2%)
                  </div>
                </div>
              </div>
              <button className="glass rounded-lg px-3 py-1.5 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all w-full mt-3">
                + Создать A/B тест
              </button>
            </div>

            <div className="glass rounded-xl p-6 neon-border">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-3">Быстрые действия</h3>
              <div className="space-y-2">
                <button className="glass rounded-lg px-3 py-2 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all w-full text-left">
                  📸 Создать резервную копию
                </button>
                <button className="glass rounded-lg px-3 py-2 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all w-full text-left">
                  📊 Отчёт о производительности
                </button>
                <button className="glass rounded-lg px-3 py-2 text-xs text-[#FAFAFA]/70 hover:bg-white/[0.04] transition-all w-full text-left">
                  🤖 Запросить AI-анализ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}