import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "LearnSphere — Многоязычная образовательная платформа",
  description: "LearnSphere объединяет миллионы через образование. Многоязычная платформа с AI-переводом, персонализированными путями обучения и глобальным доступом.",
}

export default function LearnspherePage() {
  return (
    <div className="pt-24">
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#40E0D0]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#40E0D0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#40E0D0]" />
            Концепция • 15%
          </div>
          <div className="text-6xl mb-6">📚</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">LearnSphere</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">Многоязычная образовательная платформа</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            LearnSphere объединяет миллионы через образование. Многоязычная платформа с AI-переводом, персонализированными путями обучения и глобальным доступом к знаниям.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">Стать партнёром</Link>
            <Link href="/partners" className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">Инвестировать</Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-xl p-10 neon-border">
            <h2 className="text-3xl font-bold shimmer-text mb-6">Что такое LearnSphere?</h2>
            <p className="text-[#1A0A10]/80 mb-4">Многоязычная образовательная платформа, объединяющая миллионы через курсы, сообщества и доступ к «мудрости».</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Образование ограничено языковыми и географическими барьерами. Нет доступа к качественным знаниям.</p>
              <p><strong>Решение:</strong> Курсы на десятках языков с AI-переводом/локализацией. Персонализированные пути обучения, сообщества, менторство.</p>
              <p><strong>Ценность:</strong> Доступ к образованию без барьеров (язык, гео). Для клиентов — рост навыков, для партнёров — дистрибуция контента.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Ключевые функции</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Многоязычность</h3>
              <p className="text-sm text-[#1A0A10]/80">Курсы на десятках языков с AI-переводом и локализацией. Глобальный доступ к знаниям.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Персонализация</h3>
              <p className="text-sm text-[#1A0A10]/80">Индивидуальные пути обучения, сообщества по интересам, менторство от экспертов.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Gamification</h3>
              <p className="text-sm text-[#1A0A10]/80">Геймификация, сертификаты, аналитика прогресса. Обучение становится увлекательным.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Интеграция с экспертами</h3>
              <p className="text-sm text-[#1A0A10]/80">Партнёрство с университетами и экспертами. User-generated контент от профессионалов.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Хотите стать частью проекта?</h2>
          <p className="text-[#FAFAFA]/70 mb-8">LearnSphere открыт для партнёрства и софинансирования на стадии концепции.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-8 py-4 text-base font-bold text-white neon-border transition-all hover:opacity-90">Стать партнёром</Link>
            <Link href="/partners" className="glass rounded-lg px-8 py-4 text-base font-medium text-[#FAFAFA] transition-all hover:bg-white/10">Инвестировать в проект</Link>
          </div>
        </div>
      </section>
    </div>
  )
}