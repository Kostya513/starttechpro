import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "SynergyMind — Нейро-платформа для коллективных решений",
  description: "SynergyMind — альтернатива традиционным соцсетям с AI-фасилитацией, коллективным интеллектом и синтезом идей в реальном времени.",
}

export default function SynergymindPage() {
  return (
    <div className="pt-24">
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#7E2FE0]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#3498db]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#D4AF37]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]" />
            Разработка • 65%
          </div>
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">SynergyMind</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">Нейро-платформа для коллективных решений</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            SynergyMind — это симфония коллективного разума, где технологии делают команды непобедимыми. Альтернатива традиционным соцсетям (типа Facebook/Twitter), где вместо лайков и скроллинга — структурированные обсуждения, голосования, AI-фасилитация и синтез идей в реальном времени.
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
            <h2 className="text-3xl font-bold shimmer-text mb-6">Что такое SynergyMind?</h2>
            <p className="text-[#1A0A10]/80 mb-4">Нейро-платформа (AI + нейронные сети/коллективный интеллект) для коллективного принятия решений.</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Шум соцсетей, низкая продуктивность групповых решений, отсутствие структуры в обсуждениях.</p>
              <p><strong>Решение:</strong> Платформа, где вместо лайков и скроллинга — структурированные обсуждения, голосования, AI-фасилитация и синтез идей в реальном времени.</p>
              <p><strong>Ценность:</strong> Снижает шум соцсетей, повышает продуктивность решений (групповая синергия &gt; сумма индивидуумов). Идеально для DAO, стартапов, активистов, корпоративных мозговых штурмов.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Ключевые функции</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">AI-модерация и синтез</h3>
              <p className="text-sm text-[#1A0A10]/80">Алгоритмы анализируют обсуждения, выявляют консенсус, предлагают компромиссы. Автоматическая фасилитация групповых дискуссий.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Коллективный интеллект</h3>
              <p className="text-sm text-[#1A0A10]/80">«Групповой разум» — голосования с весами (экспертиза), предсказательные рынки, Delphi-метод в цифровом виде.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Интеграции</h3>
              <p className="text-sm text-[#1A0A10]/80">Со Slack, Teams, Discord. Нейро-интерфейсы (brain-computer в будущем).</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Монетизация</h3>
              <p className="text-sm text-[#1A0A10]/80">Freemium для пользователей, подписка для команд/компаний, партнёрские интеграции, B2B-лицензии.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Хотите стать частью проекта?</h2>
          <p className="text-[#FAFAFA]/70 mb-8">SynergyMind открыт для партнёрства и софинансирования.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-8 py-4 text-base font-bold text-white neon-border transition-all hover:opacity-90">Стать партнёром</Link>
            <Link href="/partners" className="glass rounded-lg px-8 py-4 text-base font-medium text-[#FAFAFA] transition-all hover:bg-white/10">Инвестировать в проект</Link>
          </div>
        </div>
      </section>
    </div>
  )
}