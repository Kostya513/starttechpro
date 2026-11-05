import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Prompt Studio — AI Transaction Standard",
  description: "Первый релиз стандарта транзакции для рынка кастомных AI-решений глобально. Биржа, где продают не «текст», а «работающее решение».",
}

export default function PromptStudioPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#BA55D3]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#3498db]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#BA55D3]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#BA55D3]" />
            Релиз v1.0 • AI Infrastructure / B2B
          </div>
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">Prompt Studio</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">AI Transaction Standard v1.0</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            Первый релиз стандарта транзакции для рынка кастомных AI-решений глобально. Новая коммуникация ИИ и человека. Протокол, на котором бизнес заказывает интеллект, а разработчики его продают.
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
            <p className="text-[#1A0A10]/80 mb-4">Мы запускаем <strong>язык взаимодействия с ИИ</strong>.</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Хаос на рынке AI-услуг, отсутствие гарантий, низкое качество заказов.</p>
              <p><strong>Решение Prompt Studio:</strong> Профессиональный workflow (Заказ → Исполнение → Проверка → Оплата).</p>
              <p><strong>Коммуникационная миссия:</strong> Обучение бизнеса правильному взаимодействию с нейросетями через исполнителей.</p>
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
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Система заказов</h3>
              <p className="text-sm text-[#1A0A10]/80">4 уровня сложности: от простого промпта до полноценного AI-агента.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Безопасность</h3>
              <p className="text-sm text-[#1A0A10]/80">Эскроу-счета, арбитраж, гарантия возврата средств для заказчиков.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Репутация</h3>
              <p className="text-sm text-[#1A0A10]/80">Рейтинги, портфолио, уровни специалистов. Прозрачность каждого исполнителя.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Масштаб */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Масштаб коммуникации</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#BA55D3] mb-2">🌐</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Глобальность</h3>
              <p className="text-sm text-[#1A0A10]/80">Универсальный стандарт для любого рынка. Доступно из любой точки мира.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#BA55D3] mb-2">🔄</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Сетевой эффект</h3>
              <p className="text-sm text-[#1A0A10]/80">Чем больше заказов — тем выше качество исполнителей и скорость выполнения.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#BA55D3] mb-2">📈</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Экономика</h3>
              <p className="text-sm text-[#1A0A10]/80">Снижение транзакционных издержек для бизнеса и рост дохода для специалистов.</p>
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
              { year: "2026", text: "Привлечение первых 1000 исполнителей и заказчиков." },
              { year: "2027", text: "Мобильное приложение, API для разработчиков." },
              { year: "2028+", text: "Лидерство в нише, возможный exit для стратегических инвесторов." },
            ].map((item) => (
              <div key={item.year} className="glass rounded-xl p-6 neon-border flex items-center gap-6">
                <span className="text-2xl font-bold shimmer-text min-w-[100px]">{item.year}</span>
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
          <p className="text-[#FAFAFA]/70 mb-8">Prompt Studio v1.0 готов к приёму первых транзакций.</p>
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