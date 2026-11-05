import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Геопульс — Global Educational Ecosystem",
  description: "Первый релиз глобальной образовательной экосистемы нового поколения. Операционная система для жизни человека в цифровую эпоху.",
}

export default function GeopulsePage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#40E0D0]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#1E90FF]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#40E0D0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#40E0D0]" />
            Релиз v1.0 • EdTech / GovTech
          </div>
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">Геопульс</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">Global Educational Ecosystem v1.0</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            Первый релиз глобальной образовательной экосистемы нового поколения. Операционная система для жизни человека в цифровую эпоху.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">
              Стать партнёром
            </Link>
            <Link href="/partners" className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">
              Инвестировать
            </Link>
          </div>
        </div>
      </section>

      {/* Философия */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-xl p-10 neon-border">
            <h2 className="text-3xl font-bold shimmer-text mb-6">Философия первого релиза</h2>
            <p className="text-[#1A0A10]/80 mb-4">Мы запускаем не «поисковик», а <strong>инструмент познания</strong>.</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Информационный хаос. Люди тонут в данных, но не имеют знаний.</p>
              <p><strong>Решение Геопульс:</strong> Структурирование реальности через 12 сфер жизни (Природа, Право, Бизнес, Культура и др.).</p>
              <p><strong>Образовательная миссия:</strong> Пользователь взаимодействует с картой и узнает мир глубже. Это обучение через действие.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Технологическое ядро */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Технологическое ядро v1.0</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Master AI</h3>
              <p className="text-sm text-[#1A0A10]/80">Оркестратор, понимающий контекст запроса. Например, «хочу жить здесь» активирует экологию, экономику и инфраструктуру.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">12 Специализированных Агентов</h3>
              <p className="text-sm text-[#1A0A10]/80">Каждый агент — экспертный модуль, обеспечивающий глубину анализа, недоступную универсальным моделям.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Верификация данных</h3>
              <p className="text-sm text-[#1A0A10]/80">Система оценки достоверности источников (0-100%). Это фундамент доверия к платформе.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Масштаб */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Масштаб экосистемы</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#40E0D0] mb-2">🌍</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Глобальность</h3>
              <p className="text-sm text-[#1A0A10]/80">Архитектура готова к мультиязычности и мультивалютности с первого дня.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#40E0D0] mb-2">🔗</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">50+ источников</h3>
              <p className="text-sm text-[#1A0A10]/80">Возможность подключения госреестров, открытых данных и коммерческих API.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#40E0D0] mb-2">⚡</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Мгновенный анализ</h3>
              <p className="text-sm text-[#1A0A10]/80">От запроса «Где лучше жить?» до получения готового аналитического отчёта за секунды.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Перспективы */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Перспективы развития</h2>
          <div className="space-y-4">
            {[
              { year: "2026-2027", text: "Масштабирование на СНГ, мобильное приложение." },
              { year: "2028-2030", text: "Партнёрства с правительствами, интеграция с умными городами." },
              { year: "2035", text: "Становление стандартом цифровой навигации для человечества." },
            ].map((item) => (
              <div key={item.year} className="glass rounded-xl p-6 neon-border flex items-center gap-6">
                <span className="text-2xl font-bold shimmer-text min-w-[120px]">{item.year}</span>
                <p className="text-sm text-[#1A0A10]/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Хотите стать частью экосистемы?</h2>
          <p className="text-[#FAFAFA]/70 mb-8">Геопульс v1.0 готов к приёму первых пользователей и партнёров.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-8 py-4 text-base font-bold text-white neon-border transition-all hover:opacity-90">
              Стать партнёром
            </Link>
            <Link href="/partners" className="glass rounded-lg px-8 py-4 text-base font-medium text-[#FAFAFA] transition-all hover:bg-white/10">
              Инвестировать в проект
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}