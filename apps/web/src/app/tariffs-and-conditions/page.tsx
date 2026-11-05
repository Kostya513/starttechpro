import Link from "next/link"
import { getAllServicePrices, SUBSCRIPTION_PLANS } from "@/lib/pricing-calculator"

export default function TariffsAndConditionsPage() {
  const services = getAllServicePrices()

  return (
    <div className="min-h-screen">
      {/* Хедер */}
      <header className="glass-dark sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">← На главную</Link>
          <div className="flex items-center gap-4">
            <a href="/legal/privacy.md" target="_blank" rel="noopener noreferrer" className="text-xs text-[#FAFAFA]/50 hover:text-[#D4AF37] transition-colors">Политика ПДн</a>
            <a href="/legal/consent.md" target="_blank" rel="noopener noreferrer" className="text-xs text-[#FAFAFA]/50 hover:text-[#D4AF37] transition-colors">Согласие</a>
            <Link href="/dashboard" className="text-sm text-[#FAFAFA]/70 hover:text-[#D4AF37] transition-colors">Личный кабинет</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold text-[#FAFAFA] mb-4 text-center">Тарифы и условия</h1>
        <p className="text-sm text-[#FAFAFA]/50 text-center mb-12 max-w-2xl mx-auto">
          Прозрачная финансовая модель StartTechPro. Все цены указаны с учётом НДС. 
          Мы работаем по гибридной модели: предоплата за инфраструктуру + постоплата за потребление + фиксированная подписка.
        </p>

        {/* Навигация по разделам */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {["Модель оплаты", "Тарифы", "Детализация цен", "Комиссии", "Блокировка", "Партнёры", "Инвестиции", "White-Label", "152-ФЗ", "Публичная оферта"].map((section) => (
            <a
              key={section}
              href={`#section-${section.toLowerCase().replace(/[^a-zа-я0-9]/g, "-")}`}
              className="text-[10px] px-3 py-1.5 rounded-full border border-[#7E2FE0]/30 text-[#FAFAFA]/60 hover:border-[#7E2FE0] hover:text-[#FAFAFA] transition-all"
            >
              {section}
            </a>
          ))}
        </div>

        {/* 1. Модель оплаты */}
        <section id="section-модель-оплаты" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">1</span>
            Модель оплаты
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">💰 Предоплата</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  Инфраструктура (домены, хостинг) оплачивается до начала оказания услуг. 
                  Средства резервируются на кошельке и списываются при публикации проекта.
                  Стоимость публикации: 1 389 ₽ (домен на год + хостинг на месяц).
                </p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">📊 Постоплата</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  AI-токены и вычислительные ресурсы списываются ежедневно в 03:00 MSK 
                  за фактическое потребление предыдущего дня. Расчёт: (токены / 1000) × тариф × 1.75.
                </p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">🔄 Подписка</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  Фиксированная ежемесячная плата за доступ к платформе. 
                  Списывается автоматически в дату продления. Starter: 9 900 ₽, Pro: 29 900 ₽, Enterprise: 99 000 ₽.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Тарифы */}
        <section id="section-тарифы" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">2</span>
            Тарифы подписки
          </h2>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div key={plan.id} className={`glass rounded-xl p-6 neon-border ${plan.highlighted ? "ring-2 ring-[#D4AF37]" : ""}`}>
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-[#FAFAFA]">{plan.name}</div>
                  <div className="text-3xl font-bold shimmer-text mt-2">{(plan.monthlyPrice / 100).toLocaleString("ru-RU")} ₽</div>
                  <div className="text-xs text-[#FAFAFA]/50">в месяц</div>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-[#FAFAFA]/70 flex items-center gap-2">
                      <span className="text-[#40E0D0]">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-xs text-[#FAFAFA]/40 text-center">
            При годовой оплате — скидка ~17% (цена месяца в подарок)
          </div>
        </section>

        {/* 3. Детализация цен */}
        <section id="section-детализация-цен" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">3</span>
            Детализация цен на услуги
          </h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="glass rounded-xl p-6 neon-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-[#FAFAFA]">{service.name}</div>
                    <div className="text-xs text-[#FAFAFA]/50 mt-0.5">{service.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold shimmer-text">{(service.breakdown.final / 100).toLocaleString("ru-RU")} ₽</div>
                    {service.isRecurring && (
                      <div className="text-[10px] text-[#FAFAFA]/40">{service.period === "month" ? "в месяц" : "в год"}</div>
                    )}
                  </div>
                </div>
                <div className="bg-[#1A0A10] rounded-lg p-3 border border-[#7E2FE0]/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#FAFAFA]/50">Закупочная цена</span>
                    <span className="text-[#FAFAFA]/70">{(service.breakdown.cost / 100).toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#FAFAFA]/50">Наценка ({service.breakdown.markupPercent}%)</span>
                    <span className="text-[#D4AF37]">+{(service.breakdown.markupAmount / 100).toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="text-[10px] text-[#FAFAFA]/30 italic mt-2">{service.breakdown.justification}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Комиссии */}
        <section id="section-комиссии" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">4</span>
            Комиссии платформы
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#7E2FE0]/20">
                    <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Услуга</th>
                    <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Комиссия</th>
                    <th className="text-left text-xs text-[#FAFAFA]/50 font-medium px-4 py-3">Обоснование</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#7E2FE0]/10">
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">Регистрация домена</td>
                    <td className="px-4 py-3 text-xs text-[#D4AF37]">+20–50% к закупочной цене</td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/50">Автоматизация, DNS, SSL, техподдержка</td>
                  </tr>
                  <tr className="border-b border-[#7E2FE0]/10">
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">Хостинг / Трафик</td>
                    <td className="px-4 py-3 text-xs text-[#D4AF37]">+30–50% к себестоимости</td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/50">Мониторинг, бэкапы, RLS, безопасность</td>
                  </tr>
                  <tr className="border-b border-[#7E2FE0]/10">
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">AI-токены</td>
                    <td className="px-4 py-3 text-xs text-[#D4AF37]">+75% к стоимости API</td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/50">Оркестрация, память, RAG, human-in-the-loop</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/70">White-Label лицензия</td>
                    <td className="px-4 py-3 text-xs text-[#D4AF37]">15–25% от выручки партнёра</td>
                    <td className="px-4 py-3 text-xs text-[#FAFAFA]/50">Технология, бренд, поддержка</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. Правила постоплаты и блокировки */}
        <section id="section-блокировка" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">5</span>
            Правила постоплаты и блокировки
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-bold text-[#FAFAFA] mb-2">📅 Ежедневное списание AI-токенов</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  В 03:00 MSK автоматически списываются средства за потреблённые AI-токены предыдущего дня. 
                  Расчёт происходит по формуле: (количество токенов / 1000) × тариф модели × 1.75 (наценка платформы).
                </p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#FAFAFA] mb-2">📅 Ежемесячное списание подписки</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  В дату, соответствующую дате регистрации, автоматически списывается стоимость тарифа. 
                  При недостатке средств сервис переходит в режим ограниченной доступности.
                </p>
              </div>
              <div>
                <div className="text-sm font-bold text-[#FAFAFA] mb-2">🚫 Процедура блокировки</div>
                <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10 mt-2">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs text-yellow-400 shrink-0">1</div>
                    <div>
                      <div className="text-xs font-bold text-[#FAFAFA]">День 0–7: Режим «Только чтение»</div>
                      <div className="text-[10px] text-[#FAFAFA]/50">Сайт работает, редактирование заблокировано. Уведомление каждые 24 часа.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs text-red-400 shrink-0">2</div>
                    <div>
                      <div className="text-xs font-bold text-[#FAFAFA]">День 7+: Полная приостановка</div>
                      <div className="text-[10px] text-[#FAFAFA]/50">Сайт заменяется на заглушку. Уведомление каждые 24 часа.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#FAFAFA] mb-2">✅ Восстановление</div>
                <p className="text-xs text-[#FAFAFA]/60 leading-relaxed">
                  После пополнения кошелька сервис восстанавливается мгновенно. 
                  Генерируется отчёт о периоде простоя.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Партнёрская программа */}
        <section id="section-партнёры" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">6</span>
            Партнёрская программа
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">🤝 Реферальная программа</div>
                <ul className="space-y-2 text-xs text-[#FAFAFA]/60">
                  <li>• Партнёр получает 20% от подписки каждого привлечённого клиента пожизненно</li>
                  <li>• Выплаты автоматически на внутренний кошелёк раз в неделю</li>
                  <li>• Уникальная реферальная ссылка для каждого партнёра</li>
                  <li>• Дашборд со статистикой и графиками доходов</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">🏪 Технологические партнёры</div>
                <ul className="space-y-2 text-xs text-[#FAFAFA]/60">
                  <li>• Интеграция модулей (1С, Битрикс24, CRM) в маркетплейс</li>
                  <li>• Партнёр получает 70% от продажи своего модуля</li>
                  <li>• StartTechPro — 30% за дистрибуцию</li>
                  <li>• Автоматический расчёт и выплата комиссии</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Инвестиции */}
        <section id="section-инвестиции" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">7</span>
            Инвестиционное участие
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">🚀 Краудфандинг проектов</div>
                <ul className="space-y-2 text-xs text-[#FAFAFA]/60">
                  <li>• Инвесторы финансируют конкретные проекты через встроенный модуль</li>
                  <li>• StartTechPro берёт 5% за организацию сделки</li>
                  <li>• Автоматическая генерация договора инвестирования</li>
                  <li>• Прозрачная отчётность по каждому проекту</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-bold text-[#D4AF37] mb-2">📈 Revenue Share с инвесторами</div>
                <ul className="space-y-2 text-xs text-[#FAFAFA]/60">
                  <li>• До достижения кратности X3: инвестор получает % от MRR ежемесячно</li>
                  <li>• После X3: переход на классические дивиденды</li>
                  <li>• Автоматический расчёт и выплата раз в месяц</li>
                  <li>• Полная прозрачность через дашборд инвестора</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. White-Label */}
        <section id="section-white-label" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">8</span>
            White-Label для корпораций
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <p className="text-xs text-[#FAFAFA]/60 leading-relaxed mb-4">
              Корпорация покупает лицензию и получает развёрнутую копию платформы под своим брендом.
              Стоимость лицензии: Standard — 2 990 ₽, Premium — 5 990 ₽, Enterprise — 14 990 ₽.
              Ежемесячное роялти: 15–25% от выручки партнёра.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">Standard</div>
                <div className="text-xs text-[#FAFAFA]/50">Базовая лицензия, стандартный SLA</div>
              </div>
              <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">Premium</div>
                <div className="text-xs text-[#FAFAFA]/50">Выделенные серверы, расширенный SLA</div>
              </div>
              <div className="bg-[#1A0A10] rounded-lg p-4 border border-[#7E2FE0]/10">
                <div className="text-sm font-bold text-[#FAFAFA] mb-1">Enterprise</div>
                <div className="text-xs text-[#FAFAFA]/50">Полный аудит безопасности, SLA 99.9%</div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Соответствие 152-ФЗ */}
        <section id="section-152-фз" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">9</span>
            Соответствие 152-ФЗ
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <ul className="space-y-2 text-xs text-[#FAFAFA]/60">
              <li>• Все персональные данные хранятся на серверах Supabase (регион: Frankfurt/Warsaw), соответствующих требованиям 152-ФЗ</li>
              <li>• Логи транзакций хранятся 3 года в соответствии с 54-ФЗ</li>
              <li>• RLS-политики обеспечивают изоляцию данных пользователей</li>
              <li>• Service Role Key используется только в server-side роутах</li>
              <li>• YooKassa обеспечивает безопасность платежей (54-ФЗ, PCI DSS)</li>
              <li>• Пользователь может отозвать согласие на обработку ПДн в любой момент</li>
              <li>• Назначен DPO (Data Protection Officer): dpo@starttechpro.ru</li>
            </ul>
          </div>
        </section>

        {/* 10. Публичная оферта */}
        <section id="section-публичная-оферта" className="mb-16">
          <h2 className="text-xl font-bold text-[#FAFAFA] mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#7E2FE0]/30 flex items-center justify-center text-sm">10</span>
            Публичная оферта
          </h2>
          <div className="glass rounded-xl p-6 neon-border">
            <p className="text-xs text-[#FAFAFA]/60 leading-relaxed mb-4">
              Полный текст Публичной оферты доступен по ссылке ниже. Оферта содержит:
            </p>
            <ul className="space-y-2 text-xs text-[#FAFAFA]/60 mb-4">
              <li>• Порядок оплаты и постоплаты (раздел 5)</li>
              <li>• Комиссии платформы: домены +20–50%, хостинг +30–50%, AI +75% (раздел 6)</li>
              <li>• Блокировка сервиса при нулевом балансе (раздел 7)</li>
              <li>• Ответственность за контент пользователей (раздел 9)</li>
              <li>• Интеллектуальная собственность (раздел 10)</li>
              <li>• Реквизиты Исполнителя (раздел 13)</li>
            </ul>
            <div className="flex gap-3 flex-wrap">
              <a
                href="/legal/offer.md"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90 inline-block"
              >
                Открыть полный текст оферты
              </a>
              <a
                href="/legal/privacy.md"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-3 text-sm font-bold text-[#FAFAFA] transition-all hover:bg-white/10 inline-block"
              >
                Политика обработки ПДн
              </a>
              <a
                href="/legal/consent.md"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-3 text-sm font-bold text-[#FAFAFA] transition-all hover:bg-white/10 inline-block"
              >
                Согласие на обработку ПДн
              </a>
            </div>
          </div>
        </section>

        <div className="text-center space-x-4">
          <Link
            href="/dashboard/billing"
            className="gradient-neon rounded-lg px-8 py-4 text-sm font-bold text-white neon-border transition-all hover:opacity-90 inline-block"
          >
            Перейти к оплате
          </Link>
          <Link
            href="/register"
            className="glass rounded-lg px-8 py-4 text-sm font-bold text-[#FAFAFA] transition-all hover:bg-white/10 inline-block"
          >
            Зарегистрироваться
          </Link>
        </div>
      </main>
    </div>
  )
}