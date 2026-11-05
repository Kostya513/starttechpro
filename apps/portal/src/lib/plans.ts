import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * Планы подписки StartTechPro
 */
export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 9900, // 9 900 ₽/мес
    features: [
      "1 активный проект",
      "Базовые AI-агенты",
      "1 ГБ хранилища",
      "Email-поддержка",
      "Базовая аналитика",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29900, // 29 900 ₽/мес
    features: [
      "5 активных проектов",
      "Все AI-агенты",
      "10 ГБ хранилища",
      "Приоритетная поддержка",
      "Расширенная аналитика",
      "Свой домен",
      "API-доступ",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 99000, // 99 000 ₽/мес
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
}

export type PlanId = keyof typeof PLANS