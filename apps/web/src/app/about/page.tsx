import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "О компании",
  description:
    "StartTechPro — платформа-оркестратор для создания цифровых продуктов с помощью AI-агентов. Миссия, ценности, команда.",
}

const values = [
  { title: "Этичный ИИ", desc: "Искусственный интеллект с учётом моральных и культурных нюансов. Аудит на предвзятость по 180+ культурным контекстам." },
  { title: "Универсальный дизайн", desc: "Продукты для всех, независимо от возраста, способностей или контекста использования. Инклюзивность в каждом решении." },
  { title: "Архитектура интеллекта", desc: "Пять специализированных AI-агентов, работающих как единый конвейер: от анализа до деплоя." },
  { title: "Со-создание", desc: "Модель совместного владения интеллектуальной ��обственностью. Партнёрство, где каждый разделяет успех." },
]

const releasedProducts = [
  { title: "Геопульс", desc: "Глобальная образовательная экосистема. Операционная система для жизни в цифровую эпоху.", link: "/projects/geopulse" },
  { title: "BUILDVERSE", desc: "Система консолидации строительной индустрии. Цифровая ОС для физического мира.", link: "/projects/buildverse" },
  { title: "Prompt Studio", desc: "Стандарт транзакций для рынка AI-решений. Биржа кастомного интеллекта.", link: "/projects/prompt-studio" },
]

const devProjects = [
  { title: "SynergyMind", desc: "Нейро-платформа для коллективных решений.", link: "/projects/synergymind" },
  { title: "ConnectSphere", desc: "Сервис инклюзивных коммуникаций.", link: "/projects/connectsphere" },
  { title: "GrowEasy", desc: "AI-ассистент для малого бизнеса.", link: "/projects/groweasy" },
  { title: "LearnSphere", desc: "Многоязычная образовательная платформа.", link: "/projects/learnsphere" },
  { title: "GreenPulse", desc: "Эко-сервис для устойчивого бизнеса.", link: "/projects/greenpulse" },
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            О компании
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Мы проектируем будущее разработки.
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-400 font-inter">
            StartTechPro — платформа-оркестратор, которая делает создание цифровых продуктов доступным для каждого предпринимателя. Без потери качества. Без компромиссов.
          </p>
        </div>
      </section>

      {/* Видео-презентация */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-2xl">
            <div className="aspect-video relative">
              <iframe
                src="https://vk.com/video_ext.php?oid=-229825125&id=456239017&hash=5d8f343273eb8e9ff7"
                title="StartTechPro Presentation"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="premium-card text-center p-8">
            <h2 className="mb-6 text-3xl font-bold shimmer-text font-manrope">Наша миссия</h2>
            <p className="text-lg leading-relaxed text-gray-400 font-inter">
              Сделать создание цифровых продуктов таким же простым, как заказ пиццы. Клиент описывает идею — AI-агенты её реализуют. Без долгих согласований, бесконечных звонков и сорванных дедлайнов. Мы создаём экосистему, где технологии служат обществу, а прибыль идёт рука об руку с пользой.
            </p>
          </div>
        </div>
      </section>

      {/* О компании — развёрнуто */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center font-manrope">О компании в деталях</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="premium-card">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">От концепции к реализации</h3>
              <p className="text-sm text-gray-400 font-inter mb-3">Мы специализируемся на проектировании IT-продуктов любой сложности — от стартапов до корпоративных систем.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Стратегическое проектирование, от прототипов до технической документации</li>
                <li>Интеграция нейросетей и AI, автоматизация процессов, прогнозная аналитика</li>
                <li>Оптимизация и поддержка, регулярный аудит, масштабирование</li>
              </ul>
            </div>
            <div className="premium-card">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">Инновации для общества</h3>
              <p className="text-sm text-gray-400 font-inter mb-3">StartTechPro верит, что IT-ресурсы должны служить не только бизнес-целям, но и социальному благу.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>Укрепление деловых и социальных коммуникаций</li>
                <li>Повышение доступности цифровых услуг для различных слоёв населения</li>
                <li>Создание инклюзивных сред, где технологии становятся мостом между идеями и реализацией</li>
              </ul>
            </div>
            <div className="premium-card">
              <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">Партнёрство и результат</h3>
              <p className="text-sm text-gray-400 font-inter mb-3">Мы не просто исполнители, а надежные партнёры, которые сопровождают клиентов на каждом этапе.</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-400 font-inter">
                <li>От первой консультации до постпродажного обслуживания</li>
                <li>Креативность с прагматизмом — баланс инноваций и эффективности</li>
                <li>Совместное владение интеллектуальной собственностью</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center font-manrope">Наши ценности</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="premium-card text-center transition-all hover:bg-white/[0.06] animate-fade-in">
                <h3 className="mb-2 text-lg font-semibold text-[#D4AF37] font-manrope">{v.title}</h3>
                <p className="text-sm text-gray-400 font-inter">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Выпущенные продукты */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center font-manrope">Наши продукты (Релиз v1.0)</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {releasedProducts.map((p) => (
              <Link key={p.title} href={p.link} className="group">
                <div className="premium-card transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.06] h-full">
                  <h3 className="font-semibold text-[#D4AF37] mb-2 font-manrope">{p.title}</h3>
                  <p className="text-sm text-gray-400 font-inter">{p.desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#D4AF37] group-hover:text-[#7E2FE0] transition-colors font-manrope">
                    <span>Подробнее</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Проекты в разработке */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center font-manrope">Проекты в разработке</h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {devProjects.map((p) => (
              <Link key={p.title} href={p.link} className="group">
                <div className="premium-card transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.06] h-full text-center">
                  <h3 className="font-semibold text-[#D4AF37] text-sm mb-1 font-manrope">{p.title}</h3>
                  <p className="text-xs text-gray-400 font-inter">{p.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Взгляд в будущее */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold shimmer-text mb-6 font-manrope">Взгляд в будущее</h2>
          <p className="text-lg text-gray-400 font-inter mb-4">
            StartTechPro только начинает свой путь, но уже сегодня мы закладываем фундамент для технологий завтрашнего дня. Наша цель — стать катализатором позитивных изменений, где каждый продукт не просто решает задачи, но и вдохновляет на новые свершения.
          </p>
          <p className="text-xl font-bold text-[#D4AF37] font-manrope">
            StartTechPro: Где технологии встречаются с целью.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white font-manrope mb-4">Станьте частью экосистемы</h2>
          <p className="text-gray-400 font-inter mb-8">Присоединяйтесь к нам, чтобы вместе создавать цифровой ландшафт будущего — умный, человечный и бесконечно возможный.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90">Связаться с нами</Link>
            <Link href="/partners" className="bg-transparent border border-violet-500/30 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:bg-white/5">Стать партнёром</Link>
          </div>
        </div>
      </section>
    </div>
  )
}