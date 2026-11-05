import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Экосистема",
  description:
    "StartTechPro — экосистема из 5 AI-агентов: аналитик, архитектор, разработчик, тестировщик, девопс.",
}

const agents = [
  {
    role: "Аналитик",
    desc: "Исследует нишу, конкурентов и целевую аудиторию. Формирует продуктовую гипотезу и метрики успеха.",
  },
  {
    role: "Архитектор",
    desc: "Проектирует структуру продукта: модули, базу данных, API, интеграции. Создаёт техническое задание.",
  },
  {
    role: "Разработчик",
    desc: "Пишет код по ТЗ. Использует Next.js, TypeScript, Tailwind. Интегрирует бэкенд и БД.",
  },
  {
    role: "Тестировщик",
    desc: "Автотесты, проверка качества, регрессионное тестирование. Human-in-the-loop на каждом этапе.",
  },
  {
    role: "Девопс",
    desc: "Деплой на Vercel, настройка домена, SSL, мониторинг. Продукт работает 24/7.",
  },
]

export default function EcosystemPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            Экосистема
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Пять AI-агентов — одна платформа.
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-400 font-inter">
            Каждый агент — эксперт в своей области. Вместе они проходят полный цикл создания продукта: от анализа рынка до готового решения.
          </p>
        </div>
      </section>

      {/* Схема работы */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {agents.map((agent, i) => (
              <div
                key={agent.role}
                className="premium-card transition-all hover:bg-white/[0.06] hover:-translate-y-1 animate-fade-in"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#D4AF37] font-manrope">#{i + 1}</span>
                  <h3 className="text-lg font-semibold text-white font-manrope">{agent.role}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-400 font-inter">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-3xl font-bold text-white font-manrope">
            Запустите производство вашего продукта
          </h2>
          <p className="mb-8 text-gray-400 font-inter">
            Пройдите интервью с AI-агентом и получите готовое ТЗ за 15 минут.
          </p>
          <Link
            href="/register"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 inline-block rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90"
          >
            Запустить проект
          </Link>
        </div>
      </section>
    </div>
  )
}