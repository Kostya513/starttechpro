"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptedOffer, setAcceptedOffer] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedNewsletter, setAcceptedNewsletter] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const refCode = searchParams.get("ref")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!acceptedOffer) {
      setError("Необходимо принять условия Публичной оферты")
      return
    }

    if (!acceptedPrivacy) {
      setError("Необходимо дать согласие на обработку персональных данных")
      return
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов")
      return
    }

    setLoading(true)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (authError) {
      setError(authError.message === "User already registered"
        ? "Пользователь с таким email уже зарегистрирован"
        : authError.message
      )
      setLoading(false)
      return
    }

    if (authData.user) {
      // Сохраняем факт согласий в профиле
      const { createClient } = require("@supabase/supabase-js")
      const serviceClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      const now = new Date().toISOString()
      await serviceClient
        .from("profiles")
        .update({
          accepted_offer_at: acceptedOffer ? now : null,
          accepted_privacy_at: acceptedPrivacy ? now : null,
          accepted_newsletter_at: acceptedNewsletter ? now : null,
          updated_at: now,
        })
        .eq("id", authData.user.id)

      // Если есть реферальный код — привязываем
      if (refCode) {
        fetch("/api/partner/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authData.user.id, referralCode: refCode }),
        }).catch(() => {})
      }

      // Отправляем приветственное уведомление
      fetch("/api/notifications/welcome", { method: "POST" }).catch(() => {})
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#1A0A10] flex items-center justify-center">
                    <span className="text-xl font-bold shimmer-text">S</span>
                  </div>
                </div>
              </div>
              <div className="font-bold text-xl mx-2">
                <span className="text-2xl font-bold shimmer-text">S</span>
                <span className="text-[#D4AF37]">tart</span>
                <span className="text-2xl font-bold shimmer-text">T</span>
                <span className="text-[#D4AF37]">ech</span>
                <span className="text-2xl font-bold shimmer-text">P</span>
                <span className="text-[#D4AF37]">ro</span>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#FAFAFA] mt-6">Регистрация</h1>
          <p className="text-[#FAFAFA]/70 mt-2">Создайте аккаунт для управления проектами</p>
        </div>

        <div className="glass rounded-xl p-8 neon-border">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Имя</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#FAFAFA]/70">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                className="glass rounded-xl px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA]/30 focus:outline-none focus:ring-1 focus:ring-[#7E2FE0]/50"
              />
            </div>

            {/* Чекбокс 1: Публичная оферта */}
            <label className="flex items-start gap-3 text-sm text-[#FAFAFA]/70">
              <input
                type="checkbox"
                checked={acceptedOffer}
                onChange={(e) => setAcceptedOffer(e.target.checked)}
                required
                className="mt-0.5 shrink-0"
              />
              <span>
                Я принимаю условия{' '}
                <a href="/legal/offer.md" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                  Публичной оферты
                </a>
              </span>
            </label>

            {/* Чекбокс 2: Согласие на обработку ПДн */}
            <label className="flex items-start gap-3 text-sm text-[#FAFAFA]/70">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                required
                className="mt-0.5 shrink-0"
              />
              <span>
                Я даю{' '}
                <a href="/legal/consent.md" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                  согласие на обработку персональных данных
                </a>
                {' '}и ознакомлен(а) с{' '}
                <a href="/legal/privacy.md" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                  Политикой обработки ПДн
                </a>
              </span>
            </label>

            {/* Чекбокс 3: Согласие на рассылку */}
            <label className="flex items-start gap-3 text-sm text-[#FAFAFA]/70">
              <input
                type="checkbox"
                checked={acceptedNewsletter}
                onChange={(e) => setAcceptedNewsletter(e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <span>
                Я согласен(на) получать{' '}
                <a href="/legal/newsletter.md" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#7E2FE0] underline underline-offset-2">
                  уведомления и рассылки
                </a>
                {' '}(Email, Telegram, Push). Можно отписаться в любой момент.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 w-full disabled:opacity-50"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#FAFAFA]/70">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-[#D4AF37] hover:text-[#7E2FE0] transition-colors">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}