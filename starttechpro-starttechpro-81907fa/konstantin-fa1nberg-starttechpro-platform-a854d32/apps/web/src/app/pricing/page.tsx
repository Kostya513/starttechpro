import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Тарифы",
  description:
    "Выберите тариф StartTechPro: Starter 9 900 ₽/мес, Pro 29 900 ₽/мес, Enterprise 99 000 ₽/мес. Подписка с полным доступом к AI-агентам.",
}

const plans = [
  {
    name: "Starter",
    price: "9 900 ₽",
    period: "в месяц",
    desc: "Для запуска первого цифрового продукта с AI-агентами.",
    features: [
      "Интервью с AI-агентом и ТЗ",
      "До 3 страниц / модулей",
      "Базовый SEO и адаптив",
      "Деплой на Vercel",
      "Поддомен .starttechpro.ru",
      "Базовая аналитика",
      "Поддержка по email",
    ],
    cta: "Начать бесплатно",
    popular: false,
  },
  {
    name: "Pro",
    price: "29 900 ₽",
    period: "в месяц",
    desc: "Для полноценного цифрового продукта с полным циклом AI-производства.",
    features: [
      "Всё из Starter",
      "До 10 страниц / модулей",
      "Все 5 AI-агентов в производстве",
      "Интеграция с CRM и аналитикой",
      "Приём платежей (YooKassa)",
      "Свой домен и SSL",
      "Приоритетная поддержка 24/7",
    ],
    cta: "Выбрать Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99 000 ₽",
    period: "в месяц",
    desc: "Для сложных B2B-платформ и масштабных систем.",
    features: [
      "Всё из Pro",
      "Неограниченно страниц и проектов",
      "Выделенные AI-агенты",
      "White-label опция",
      "SLA 24/7 с персональным менеджером",
      "Интеграция с 1С / Битрикс24",
      "Обучение команды",
      "Полная аналитика и отчёты",
    ],
    cta: "Связаться с нами",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
            Тарифы
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-white font-manrope">
            Инвестиция в результат.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 font-inter">
            Прозрачное ценообразование без скрытых платежей. Выберите уровень, соответствующий масштабу ваших амбиций.
          </p>
        </div>
      </section>

      {/* Планы */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all animate-fade-in ${
                  plan.popular
                    ? "premium-card scale-105 border-violet-500/50"
                    : "premium-card hover:bg-white/[0.06]"
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-violet-600 to-cyan-600 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white font-manrope">
                    Популярный
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-white font-manrope">{plan.name}</h2>
                  <div className="mb-1">
                    <span className="text-4xl font-bold shimmer-text font-manrope">{plan.price}</span>
                  </div>
                  <span className="text-sm text-gray-400 font-inter">{plan.period}</span>
                </div>

                <p className="mb-6 text-sm text-gray-400 font-inter">{plan.desc}</p>

                <ul className="mb-8 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-400 font-inter"
                    >
                      <span className="mt-0.5 text-[#D4AF37]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/contacts" : "/register"}
                  className={`block w-full rounded-full py-3 text-center text-sm font-medium transition-all font-manrope ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90"
                      : "bg-transparent border border-violet-500/30 text-white hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Дополнительная информация */}
          <div className="mt-12 premium-card text-center max-w-3xl mx-auto p-8">
            <h3 className="text-lg font-semibold text-white font-manrope mb-3">Детальная информация о тарифах</h3>
            <p className="text-sm text-gray-400 font-inter mb-4">
              Полные условия, описание всех функций и юридические аспекты — на странице тарифов и условий.
            </p>
            <Link
              href="/tariffs-and-conditions"
              className="text-[#D4AF37] hover:text-[#7E2FE0] transition-colors text-sm underline underline-offset-2 font-manrope"
            >
              Подробнее о тарифах и условиях
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}