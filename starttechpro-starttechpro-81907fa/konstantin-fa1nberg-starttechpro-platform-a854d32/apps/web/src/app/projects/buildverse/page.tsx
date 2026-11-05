import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "BUILDVERSE — Construction OS",
  description: "Первый релиз системы абсолютной консолидации строительной индустрии. Цифровая операционная система для физического мира.",
}

export default function BuildversePage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#7E2FE0]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#D4AF37]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]" />
            Релиз v1.0 • PropTech / Industrial
          </div>
          <div className="text-6xl mb-6">🏗️</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">BUILDVERSE</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">Construction OS v1.0</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            Первый релиз системы абсолютной консолидации строительной индустрии. Объединяем всё: от азов фундамента до новейшей архитектуры и культурного наследия вековых эпох.
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
            <p className="text-[#1A0A10]/80 mb-4">Мы запускаем <strong>стандарт отрасли</strong>.</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Фрагментация, непрозрачность, утрата качества и наследия.</p>
              <p><strong>Решение BUILDVERSE:</strong> Единый ИИ-агент «СтройМакс» координирует весь цикл. Единая BIM-модель хранит историю объекта.</p>
              <p><strong>Культурная миссия:</strong> Сохранение информации о здании на 50+ лет вперед. Цифровой паспорт как наследие.</p>
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
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">10 Микросервисов</h3>
              <p className="text-sm text-[#1A0A10]/80">От Геоинтеллекта до Цифрового Паспорта. Полный цикл управления строительством.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Суверенная совместимость</h3>
              <p className="text-sm text-[#1A0A10]/80">Учёт СНиП, ГОСТ, СП РФ. Готовность к интеграции с гос. системами (цифровые паспорта с 2026 г.).</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Безопасность</h3>
              <p className="text-sm text-[#1A0A10]/80">Верифицированные подрядчики, прозрачные сметы, фиксация этапов строительства.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Масштаб */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Масштаб консолидации</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">🏛️</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Индустрия</h3>
              <p className="text-sm text-[#1A0A10]/80">Объединение частных застройщиков, профессионалов, поставщиков и государства в одной среде.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">📜</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Наследие</h3>
              <p className="text-sm text-[#1A0A10]/80">Каждое здание получает цифровую историю. Это вклад в архитектуру будущего.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">💰</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Экономика</h3>
              <p className="text-sm text-[#1A0A10]/80">Прозрачный рынок материалов и услуг без скрытых наценок.</p>
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
              { year: "2026", text: "Пилот в Курской области, отработка логики." },
              { year: "2027", text: "Масштабирование на ЦФО, интеграция с поставщиками." },
              { year: "2028+", text: "Стандарт для всей отрасли РФ/СНГ, экспорт решения." },
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
          <p className="text-[#FAFAFA]/70 mb-8">BUILDVERSE v1.0 готов к пилотной эксплуатации в Курской области.</p>
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