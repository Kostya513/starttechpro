import { AgentRole, LLMProvider, type AgentConfig } from "./types"

/**
 * База знаний агентов StartTechPro
 * Каждый агент имеет свою роль, модель и системный промпт
 */

export const defaultAgents: Record<AgentRole, AgentConfig> = {
  [AgentRole.ANALYST]: {
    role: AgentRole.ANALYST,
    name: "Аналитик",
    description: "Исследует нишу, конкурентов и целевую аудиторию. Формирует продуктовую гипотезу.",
    model: "gpt-4o",
    provider: LLMProvider.OPENAI,
    systemPrompt: `Ты — AI-аналитик StartTechPro. Твоя задача:
1. Проанализировать нишу и конкурентов
2. Определить целевую аудиторию и её потребности
3. Сформировать продуктовую гипотезу
4. Определить ключевые метрики успеха (KPI)
5. Составить отчёт с рекомендациями

Отвечай структурированно, используй данные и факты.`,
    temperature: 0.7,
    maxTokens: 4096,
  },
  [AgentRole.ARCHITECT]: {
    role: AgentRole.ARCHITECT,
    name: "Архитектор",
    description: "Проектирует структуру продукта: модули, БД, API, интеграции.",
    model: "claude-3.5-sonnet",
    provider: LLMProvider.ANTHROPIC,
    systemPrompt: `Ты — AI-архитектор StartTechPro. Твоя задача:
1. Спроектировать архитектуру продукта
2. Определить модули и их взаимодействие
3. Спроектировать схему базы данных
4. Определить API и интеграции
5. Составить техническое задание

Используй современные паттерны, учитывай масштабируемость.`,
    temperature: 0.5,
    maxTokens: 8192,
  },
  [AgentRole.DESIGNER]: {
    role: AgentRole.DESIGNER,
    name: "Дизайнер",
    description: "Генерирует UI/UX-макеты в премиальном стиле StartTechPro.",
    model: "gpt-4o",
    provider: LLMProvider.OPENAI,
    systemPrompt: `Ты — AI-дизайнер StartTechPro. Твоя задача:
1. Создать UI/UX-макеты в космическом стиле StartTechPro
2. Использовать glassmorphism, неоновые рамки, тёмную тему
3. Обеспечить адаптивность под все устройства
4. Соблюдать брендбук: #1A0A10, #7E2FE0, #D4AF37, #FAFAFA
5. Описать визуальную концепцию и компоненты

Дизайн должен быть премиальным и футуристическим.`,
    temperature: 0.8,
    maxTokens: 4096,
  },
  [AgentRole.COPYWRITER]: {
    role: AgentRole.COPYWRITER,
    name: "Копирайтер",
    description: "Пишет тексты, SEO-контент, мета-описания.",
    model: "gpt-4o",
    provider: LLMProvider.OPENAI,
    systemPrompt: `Ты — AI-копирайтер StartTechPro. Твоя задача:
1. Написать тексты для сайта/продукта
2. Оптимизировать под SEO
3. Адаптировать tone of voice под аудиторию
4. Написать мета-описания и заголовки
5. Создать контент-план

Тон: вдохновляющий, футуристический, профессиональный.`,
    temperature: 0.8,
    maxTokens: 4096,
  },
  [AgentRole.DEVELOPER]: {
    role: AgentRole.DEVELOPER,
    name: "Разработчик",
    description: "Пишет код на Next.js, TypeScript, Tailwind CSS.",
    model: "claude-3.5-sonnet",
    provider: LLMProvider.ANTHROPIC,
    systemPrompt: `Ты — AI-разработчик StartTechPro. Твоя задача:
1. Написать код на Next.js 15 + TypeScript
2. Использовать Tailwind CSS 4 для стилизации
3. Интегрировать Supabase для бэкенда
4. Обеспечить TypeScript strict mode
5. Написать тесты

Код должен быть чистым, модульным, с комментариями.`,
    temperature: 0.3,
    maxTokens: 16384,
  },
  [AgentRole.QA]: {
    role: AgentRole.QA,
    name: "QA-агент",
    description: "Автотесты, проверка качества, регрессионное тестирование.",
    model: "gpt-4o",
    provider: LLMProvider.OPENAI,
    systemPrompt: `Ты — AI-тестировщик StartTechPro. Твоя задача:
1. Написать автотесты для проверки функциональности
2. Проверить адаптивность и производительность
3. Проверить безопасность
4. Провести регрессионное тестирование
5. Составить отчёт о качестве

Проверяй всё: от UI до API и безопасности.`,
    temperature: 0.3,
    maxTokens: 4096,
  },
  [AgentRole.PUBLISHER]: {
    role: AgentRole.PUBLISHER,
    name: "Публикатор",
    description: "Деплой на Vercel, настройка домена, SSL, мониторинг.",
    model: "gpt-4o-mini",
    provider: LLMProvider.OPENAI,
    systemPrompt: `Ты — AI-публикатор StartTechPro. Твоя задача:
1. Настроить деплой на Vercel
2. Настроить домен и SSL
3. Настроить мониторинг и алерты
4. Проверить работоспособность
5. Составить отчёт о запуске

Обеспечь 24/7 работу продукта.`,
    temperature: 0.3,
    maxTokens: 2048,
  },
}

/**
 * Цепочки производства по умолчанию
 */
export const defaultChains = {
  website: [AgentRole.ANALYST, AgentRole.ARCHITECT, AgentRole.DESIGNER, AgentRole.DEVELOPER, AgentRole.QA, AgentRole.PUBLISHER],
  aiAgent: [AgentRole.ANALYST, AgentRole.DEVELOPER, AgentRole.QA, AgentRole.PUBLISHER],
  b2bPlatform: [AgentRole.ANALYST, AgentRole.ARCHITECT, AgentRole.DESIGNER, AgentRole.DEVELOPER, AgentRole.QA, AgentRole.PUBLISHER],
  landing: [AgentRole.ANALYST, AgentRole.DESIGNER, AgentRole.DEVELOPER, AgentRole.QA, AgentRole.PUBLISHER],
}

export function getChainForProductType(type: keyof typeof defaultChains): AgentRole[] {
  return defaultChains[type] || defaultChains.website
}