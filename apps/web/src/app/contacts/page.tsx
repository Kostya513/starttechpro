"use client"

import Link from "next/link"
import { useState } from "react"

export default function ContactsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, message }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка отправки")
      }

      setSent(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки сообщения")
    }

    setSending(false)
  }

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            Контакты
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Начнём диалог.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 font-inter">
            Расскажите о вашем проекте — мы ответим в течение 24 часов.
          </p>
        </div>
      </section>

      {/* Форма + контакты */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Форма */}
            <div className="premium-card p-8">
              <h2 className="mb-6 text-2xl font-bold shimmer-text font-manrope">Напишите нам</h2>

              {sent ? (
                <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                  <div className="font-semibold mb-1 font-manrope">Сообщение отправлено</div>
                  <div className="text-green-400/70 font-inter">Мы свяжемся с вами в ближайшее время.</div>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 text-xs text-[#D4AF37] hover:text-[#7E2FE0] transition-colors font-manrope"
                  >
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-inter">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-inter">Имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ваше имя"
                      className="bg-white/5 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 font-inter"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-inter">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white/5 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 font-inter"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-inter">Телефон (опционально)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      className="bg-white/5 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 font-inter"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-inter">Сообщение *</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Опишите вашу задачу..."
                      className="bg-white/5 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 resize-none font-inter"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full px-6 py-3 text-sm font-medium text-white font-manrope transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Отправка...
                      </span>
                    ) : (
                      "Отправить"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Контактная информация */}
            <div className="flex flex-col gap-6">
              <div className="premium-card p-8">
                <h2 className="mb-6 text-2xl font-bold shimmer-text font-manrope">Наши контакты</h2>
                <div className="flex flex-col gap-4 text-sm text-gray-400 font-inter">
                  <div>
                    <span className="block text-white font-medium font-manrope">Email</span>
                    <a href="mailto:info@starttechpro.com" className="text-[#D4AF37] transition-colors hover:text-[#7E2FE0]">info@starttechpro.com</a>
                  </div>
                  <div>
                    <span className="block text-white font-medium font-manrope">Социальные сети</span>
                    <div className="flex gap-4 mt-2">
                      <a href="https://vk.com/club229825125" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 16.711h-1.962c-.77 0-.952-.613-2.261-1.922-1.138-1.103-1.683-1.228-1.962-1.228-.403 0-.522.114-.522.671v1.749c0 .488-.137.73-1.184.73-1.751 0-3.633-.95-4.99-2.95-2.028-3.114-2.582-5.49-2.582-5.981 0-.228.114-.432.67-.432h1.962c.502 0 .683.228.876.76.952 2.728 2.545 5.112 3.197 5.112.243 0 .354-.114.354-.73v-2.834c-.073-1.313-.765-1.427-.765-1.9 0-.228.19-.432.495-.432h3.075c.426 0 .559.228.559.73v3.816c0 .414.19.556.305.556.243 0 .452-.142.904-.594 1.4-1.556 2.414-3.954 2.414-3.954.137-.33.366-.625.88-.625h1.962c.59 0 .726.304.59.73-.243 1.141-2.607 4.439-2.607 4.439-.201.33-.268.476 0 .838.2.304.88.913 1.316 1.464.813 1.037 1.4 1.9 1.574 2.5.196.6-.073.903-.647.903z"/></svg>
                      </a>
                      <a href="https://t.me/StartTechPro" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.175 1.933-.927 6.605-1.308 8.763-.16.906-.475 1.213-.779 1.243-.663.07-1.166-.441-1.809-.865-1.007-.659-1.576-1.067-2.552-1.712-1.124-.747-.395-1.158.245-1.828.166-.178 3.055-2.8 3.11-3.035.007-.033.013-.161-.062-.227-.074-.068-.173-.44-.248-.042-.103.021-1.777 1.13-5.021 3.315-.476.327-.907.486-1.294.478-.425-.008-1.246-.24-1.854-.438-.75-.243-1.345-.374-1.292-.789.027-.217.326-.435.896-.659 3.511-1.523 5.862-2.527 7.043-3.011 3.353-1.385 4.05-1.627 4.502-1.636.14-.002.27.016.384.06.318.126.41.402.376.643z"/></svg>
                      </a>
                      <a href="https://dzen.ru/id/67e5cb18e229701494c6515b" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.34 24H1.86C.83 24 0 23.17 0 22.14V1.86C0 .83.83 0 1.86 0h19.28C22.17 0 23 .83 23 1.86v19.28c0 1.03-.83 1.86-1.86 1.86h-7.8zm-1.69-2.93c.65 0 1.18-.53 1.18-1.18v-8.93l-8.32 8.32h6.25c.47 0 .89.32 1.14.62l-.25 1.17zm-5.08-18.14c-.65 0-1.18.53-1.18 1.18v8.93l8.32-8.32H9.28c-.47 0-.89-.32-1.14-.62l.25-1.17h-1.82zm11.08 4.71l-8.32 8.32h6.57c.65 0 1.18-.53 1.18-1.18V8.92c0-.47.32-.89.62-1.14l-1.17-.25h1.12v.11zm-10.3 8.32l8.32-8.32h-6.57c-.65 0-1.18.53-1.18 1.18v6.01c0 .47-.32.89-.62 1.14l1.17.25h-1.12v-.26z"/></svg>
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="block text-white font-medium font-manrope">Другие платформы</span>
                    <div className="flex gap-3 mt-1">
                      <a href="https://vc.ru/u/2955029-starttechpro" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] transition-colors text-sm">VC.RU</a>
                      <a href="https://tenchat.ru/4458910" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] transition-colors text-sm">TenChat</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="premium-card p-8">
                <h2 className="mb-4 text-2xl font-bold shimmer-text font-manrope">Не хотите ждать?</h2>
                <p className="mb-6 text-sm text-gray-400 font-inter">
                  Запустите проект прямо сейчас — AI-интервьюер задаст 7 вопросов и сформирует ТЗ за 15 минут.
                </p>
                <Link href="/register" className="bg-gradient-to-r from-violet-600 to-cyan-600 inline-block rounded-full px-6 py-3 text-sm font-medium text-white font-manrope transition-all hover:opacity-90">
                  Запустить проект
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}