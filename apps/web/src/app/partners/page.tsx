import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Партнёрская программа",
  description:
    "StartTechPro — партнёрская программа для IT-стартапов, инвесторов и корпораций. Совместное создание инновационных IT-решений.",
}

export default function PartnersPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            Партнёры
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Растите вместе с платформой.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 font-inter">
            Партнёрская программа с прозрачной структурой вознаграждений и долгосрочной моделью дохода.
          </p>
        </div>
      </section>

      {/* Почему стоит стать партнёром */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold shimmer-text font-manrope">Почему стоит стать нашим партнёром?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">1. Доступ к уникальным разработкам</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Участие в создании революционных IT-продуктов, а не просто типовых решений.</li>
                <li>Возможность влиять на концепцию на ранних этапах.</li>
              </ul>
            </div>

            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">2. Совместное владение интеллектуальной собственностью</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Гибкие условия по патентам и авторским правам.</li>
                <li>Возможность монетизации через лицензирование или совместные стартапы.</li>
              </ul>
            </div>

            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">3. Эксклюзивные рыночные преимущества</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Первыми получаете доступ к альтернативным технологическим платформам, которых ещё нет на массовом рынке.</li>
                <li>Право на адаптацию продуктов под ваш сегмент.</li>
              </ul>
            </div>

            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">4. Прямая вовлечённость в R&D</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Ваши эксперты могут участвовать в формировании функционала.</li>
                <li>Доступ к нашим исследованиям будущих трендов.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Форматы партнёрства */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold shimmer-text font-manrope">Форматы партнёрства</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">Технологическое партнёрство</h3>
              <p className="text-sm text-gray-400 font-inter mb-2"><span className="font-medium">Для:</span> IT-стартапов, инновационных лабораторий, университетов.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Обмен экспертизой</li>
                <li>Совместная разработка MVP</li>
                <li>Разделение прибыли от внедрения</li>
              </ul>
            </div>

            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">Инвестиционное партнёрство</h3>
              <p className="text-sm text-gray-400 font-inter mb-2"><span className="font-medium">Для:</span> Венчурных фондов, бизнес-ангелов, корпоративных инновационных фондов.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Финансирование перспективных концепций</li>
                <li>Возможность выкупа доли в проекте</li>
                <li>Приоритетное право на масштабирование</li>
              </ul>
            </div>

            <div className="premium-card animate-fade-in">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">Стратегическое партнёрство</h3>
              <p className="text-sm text-gray-400 font-inter mb-2"><span className="font-medium">Для:</span> Крупных компаний, ищущих прорывные решения.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Эксклюзивная адаптация технологий под ваш бизнес</li>
                <li>Совместные пилоты с перспективой внедрения</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Пример текущего проекта */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="premium-card text-center animate-fade-in p-10">
            <h2 className="text-3xl font-bold shimmer-text mb-4 font-manrope">Пример текущего проекта</h2>
            <p className="text-lg text-gray-400 font-inter italic">
              «Нейро-платформа для коллективного принятия решений» (альтернатива традиционным соцсетям).
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-xl font-bold text-white font-manrope mb-4">
            StartTechPro — это не просто IT. Это новые правила игры.
          </p>
          <p className="text-gray-400 font-inter mb-8">
            Хотите создавать будущее? Давайте обсудим возможности.
          </p>
          <Link
            href="/contacts"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90"
          >
            Обсудить
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}