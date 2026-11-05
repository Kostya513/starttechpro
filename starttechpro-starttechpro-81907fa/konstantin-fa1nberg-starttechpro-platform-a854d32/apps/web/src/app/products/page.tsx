import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Продукты и сервисы",
  description:
    "StartTechPro создаёт веб-сайты, AI-агентов, B2B-платформы и строительные системы под ключ. Премиальная цифровая инженерия.",
}

const products = [
  {
    title: "Веб-сайты",
    desc: "Лендинги, корпоративные сайты, интернет-магазины, многостраничные порталы.",
    features: [
      "Next.js 15 + TypeScript + Tailwind CSS 4",
      "SEO-оптимизация (Lighthouse ≥ 95)",
      "Адаптив под все устройства",
      "Интеграция с CRM и аналитикой",
      "AI-оптимизация конверсии",
    ],
    price: "от 50 000 ₽",
  },
  {
    title: "AI-агенты",
    desc: "Чат-боты, AI-ассистенты, агенты для автоматизации бизнес-процессов.",
    features: [
      "LangGraph + LangChain оркестрация",
      "OpenAI / YandexGPT",
      "RAG по базе знаний компании",
      "Интеграция через API",
      "Human-in-the-loop контроль",
    ],
    price: "от 120 000 ₽",
  },
  {
    title: "B2B-платформы",
    desc: "Маркетплейсы, SaaS-решения, CRM, ERP-системы с нуля под ключ.",
    features: [
      "Supabase + PostgreSQL + RLS",
      "Мультиарендная архитектура",
      "Row-Level Security",
      "Real-time обновления",
      "ЭДО и платежи (YooKassa)",
    ],
    price: "от 300 000 ₽",
  },
  {
    title: "Строительные системы",
    desc: "Сметные калькуляторы, BIM-порталы, системы управления проектами для стройки.",
    features: [
      "Интеграция с 1С и Госуслугами",
      "Калькуляторы смет и материалов",
      "Календарные графики (Gantt)",
      "Документооборот и ЭДО",
      "Мобильная версия (PWA)",
    ],
    price: "от 400 000 ₽",
  },
]

export default function ProductsPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            Продукты
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Решения для бизнеса.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 font-inter">
            От лендинга до сложной B2B-платформы — каждый продукт создаётся командой AI-агентов под руководством человека.
          </p>
        </div>
      </section>

      {/* Продукты */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.title}
                className="premium-card transition-all hover:bg-white/[0.06] animate-fade-in"
              >
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white font-manrope">{product.title}</h2>
                </div>
                <p className="mb-6 text-gray-400 font-inter">{product.desc}</p>
                <ul className="mb-6 flex flex-col gap-2">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-400 font-inter"
                    >
                      <span className="text-[#D4AF37]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold shimmer-text font-manrope">{product.price}</span>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full px-5 py-2 text-sm font-medium text-white font-manrope transition-all hover:opacity-90"
                  >
                    Заказать
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}