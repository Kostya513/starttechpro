/**
 * Pricing Calculator — прозрачный калькулятор цен StartTechPro
 *
 * Все цены отображаются с детализацией:
 * - Закупочная цена (cost)
 * - Наценка платформы (markup)
 * - Итоговая цена для пользователя (final)
 * - Обоснование наценки (justification)
 */

// ============================================
// Типы данных
// ============================================

export interface PriceBreakdown {
  category: string
  cost: number // закупочная цена в копейках
  markupPercent: number // наценка в %
  markupAmount: number // сумма наценки в копейках
  final: number // итоговая цена в копейках
  justification: string // обоснование
}

export interface ServicePrice {
  id: string
  name: string
  description: string
  breakdown: PriceBreakdown
  isRecurring: boolean
  period?: "month" | "year" | "one-time"
}

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  highlighted?: boolean
}

// ============================================
// Конфигурация закупочных цен
// ============================================

const WHOLESALE_PRICES = {
  // Домены (закупка у регистраторов)
  domain_ru: { cost: 59000, markupPercent: 50, justification: "Автоматизация регистрации, DNS-менеджмент, SSL-сертификат, техподдержка" }, // 590 ₽ → 890 ₽
  domain_rf: { cost: 69000, markupPercent: 45, justification: "Автоматизация регистрации, DNS-менеджмент, SSL-сертификат, техподдержка" }, // 690 ₽ → 1 000 ₽
  domain_com: { cost: 99000, markupPercent: 40, justification: "Автоматизация регистрации, DNS-менеджмент, SSL-сертификат, техподдержка" }, // 990 ₽ → 1 390 ₽
  domain_custom: { cost: 0, markupPercent: 30, justification: "Настройка CNAME, SSL, DNS, редиректы" },

  // Хостинг (Vercel/Cloudflare себестоимость)
  hosting_basic: { cost: 20000, markupPercent: 50, justification: "Мониторинг uptime, ежедневные бэкапы, RLS-изоляция, автоматическое масштабирование" }, // 200 ₽ → 300 ₽
  hosting_pro: { cost: 50000, markupPercent: 40, justification: "Мониторинг uptime, ежедневные бэкапы, RLS-изоляция, автоматическое масштабирование, CDN" }, // 500 ₽ → 700 ₽
  hosting_enterprise: { cost: 150000, markupPercent: 30, justification: "Выделенные серверы, аудит безопасности, SLA 99.9%, персональный менеджер" }, // 1 500 ₽ → 1 950 ₽

  // AI-токены (себестоимость API)
  ai_gpt4o: { cost: 10, markupPercent: 75, justification: "Оркестрация, RAG-контекст, human-in-the-loop, логирование" }, // 10 ₽/1K → 17.5 ₽/1K
  ai_gpt4o_mini: { cost: 2, markupPercent: 75, justification: "Оркестрация, RAG-контекст, human-in-the-loop, логирование" }, // 2 ₽/1K → 3.5 ₽/1K
  ai_claude: { cost: 15, markupPercent: 75, justification: "Оркестрация, RAG-контекст, human-in-the-loop, логирование" }, // 15 ₽/1K → 26.25 ₽/1K
  ai_yandexgpt: { cost: 5, markupPercent: 75, justification: "Оркестрация, RAG-контекст, human-in-the-loop, логирование" }, // 5 ₽/1K → 8.75 ₽/1K

  // Prompt Studio (комиссия маркетплейса)
  prompt_commission_basic: { cost: 0, markupPercent: 15, justification: "Эскроу-счёт, арбитраж споров, гарантия качества, модерация" },
  prompt_commission_pro: { cost: 0, markupPercent: 10, justification: "Эскроу-счёт, арбитраж споров, гарантия качества, модерация, продвижение" },
  prompt_commission_enterprise: { cost: 0, markupPercent: 5, justification: "Эскроу-счёт, арбитраж споров, гарантия качества, модерация, продвижение, выделенный менеджер" },
}

// ============================================
// Калькулятор
// ============================================

/**
 * Расчёт детализации цены для услуги
 */
export function calculatePriceBreakdown(
  cost: number,
  markupPercent: number,
  justification: string,
  category: string
): PriceBreakdown {
  const markupAmount = Math.round(cost * (markupPercent / 100))
  return {
    category,
    cost,
    markupPercent,
    markupAmount,
    final: cost + markupAmount,
    justification,
  }
}

/**
 * Получение цены домена с детализацией
 */
export function getDomainPrice(domain: "ru" | "рф" | "com" | "custom"): PriceBreakdown {
  const key = `domain_${domain === "рф" ? "rf" : domain}` as keyof typeof WHOLESALE_PRICES
  const config = WHOLESALE_PRICES[key]
  return calculatePriceBreakdown(config.cost, config.markupPercent, config.justification, `Домен .${domain}`)
}

/**
 * Получение цены хостинга с детализацией
 */
export function getHostingPrice(tier: "basic" | "pro" | "enterprise"): PriceBreakdown {
  const key = `hosting_${tier}` as keyof typeof WHOLESALE_PRICES
  const config = WHOLESALE_PRICES[key]
  return calculatePriceBreakdown(
    config.cost,
    config.markupPercent,
    config.justification,
    `Хостинг ${tier === "basic" ? "Базовый" : tier === "pro" ? "Pro" : "Enterprise"}`
  )
}

/**
 * Получение цены AI-токенов с детализацией
 */
export function getAITokenPrice(model: string): PriceBreakdown {
  const key = `ai_${model.replace(/[.-]/g, "_").toLowerCase()}` as keyof typeof WHOLESALE_PRICES
  const config = WHOLESALE_PRICES[key] || WHOLESALE_PRICES.ai_gpt4o
  return calculatePriceBreakdown(config.cost, config.markupPercent, config.justification, `AI-токены (${model})`)
}

/**
 * Получение комиссии Prompt Studio
 */
export function getPromptCommission(tier: "basic" | "pro" | "enterprise"): PriceBreakdown {
  const key = `prompt_commission_${tier}` as keyof typeof WHOLESALE_PRICES
  const config = WHOLESALE_PRICES[key]
  return calculatePriceBreakdown(0, config.markupPercent, config.justification, `Комиссия Prompt Studio (${tier})`)
}

/**
 * Полная стоимость публикации проекта
 */
export function getPublishingCost(domain: "ru" | "рф" | "com" | "custom", hostingTier: "basic" | "pro" | "enterprise"): {
  domain: PriceBreakdown
  hosting: PriceBreakdown
  total: number
  items: PriceBreakdown[]
} {
  const domainPrice = getDomainPrice(domain)
  const hostingPrice = getHostingPrice(hostingTier)

  return {
    domain: domainPrice,
    hosting: hostingPrice,
    total: domainPrice.final + hostingPrice.final,
    items: [domainPrice, hostingPrice],
  }
}

/**
 * Все услуги с детализацией для страницы /dashboard/billing/breakdown
 */
export function getAllServicePrices(): ServicePrice[] {
  return [
    {
      id: "domain-ru",
      name: "Домен .ru",
      description: "Регистрация домена в зоне .RU на 1 год с автоматической настройкой",
      breakdown: getDomainPrice("ru"),
      isRecurring: true,
      period: "year",
    },
    {
      id: "domain-rf",
      name: "Домен .РФ",
      description: "Регистрация домена в зоне .РФ на 1 год с автоматической настройкой",
      breakdown: getDomainPrice("рф"),
      isRecurring: true,
      period: "year",
    },
    {
      id: "domain-com",
      name: "Домен .com",
      description: "Регистрация домена в зоне .COM на 1 год с автоматической настройкой",
      breakdown: getDomainPrice("com"),
      isRecurring: true,
      period: "year",
    },
    {
      id: "hosting-basic",
      name: "Хостинг Базовый",
      description: "Хостинг для одного проекта: мониторинг, бэкапы, RLS-изоляция",
      breakdown: getHostingPrice("basic"),
      isRecurring: true,
      period: "month",
    },
    {
      id: "hosting-pro",
      name: "Хостинг Pro",
      description: "Хостинг для до 5 проектов: CDN, расширенный мониторинг, приоритетная поддержка",
      breakdown: getHostingPrice("pro"),
      isRecurring: true,
      period: "month",
    },
    {
      id: "hosting-enterprise",
      name: "Хостинг Enterprise",
      description: "Выделенные серверы, аудит безопасности, SLA 99.9%, персональный менеджер",
      breakdown: getHostingPrice("enterprise"),
      isRecurring: true,
      period: "month",
    },
    {
      id: "ai-gpt4o",
      name: "AI-токены GPT-4o",
      description: "Генерация кода, архитектуры, дизайна через GPT-4o (за 1K токенов)",
      breakdown: getAITokenPrice("gpt-4o"),
      isRecurring: false,
    },
    {
      id: "ai-gpt4o-mini",
      name: "AI-токены GPT-4o Mini",
      description: "Базовые задачи через GPT-4o Mini (за 1K токенов)",
      breakdown: getAITokenPrice("gpt-4o-mini"),
      isRecurring: false,
    },
    {
      id: "ai-claude",
      name: "AI-токены Claude 3.5",
      description: "Сложные аналитические задачи через Claude 3.5 Sonnet (за 1K токенов)",
      breakdown: getAITokenPrice("claude-3.5"),
      isRecurring: false,
    },
    {
      id: "ai-yandexgpt",
      name: "AI-токены YandexGPT",
      description: "Задачи с требованиями 152-ФЗ через YandexGPT (за 1K токенов)",
      breakdown: getAITokenPrice("yandexgpt"),
      isRecurring: false,
    },
  ]
}

/**
 * Планы подписки с ценами
 */
export const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 9900,
    annualPrice: 99000, // 8 250 ₽/мес при годовой оплате
    features: [
      "1 активный проект",
      "Базовые AI-агенты",
      "1 ГБ хранилища",
      "Email-поддержка",
      "Базовая аналитика",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29900,
    annualPrice: 299000, // 24 917 ₽/мес при годовой оплате
    features: [
      "5 активных проектов",
      "Все AI-агенты",
      "10 ГБ хранилища",
      "Приоритетная поддержка",
      "Расширенная аналитика",
      "Свой домен",
      "API-доступ",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 99000,
    annualPrice: 990000, // 82 500 ₽/мес при годовой оплате
    features: [
      "Неограниченные проекты",
      "Выделенные AI-агенты",
      "100 ГБ хранилища",
      "Персональный менеджер",
      "Полная аналитика",
      "SLA 99.9%",
      "Кастомная интеграция",
      "Обучение команды",
    ],
  },
]