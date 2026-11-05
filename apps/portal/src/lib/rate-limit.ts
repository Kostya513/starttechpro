/**
 * Rate Limiter — ограничение частоты запросов к API
 *
 * In-memory реализация для development.
 * В production: замена на Redis-based rate limiter (Upstash).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Очистка просроченных записей каждые 60 секунд
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60_000)

export interface RateLimitConfig {
  /** Максимальное количество запросов */
  maxRequests: number
  /** Окно времени в миллисекундах */
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 60,  // 60 запросов
  windowMs: 60_000, // в минуту
}

const API_CONFIG: RateLimitConfig = {
  maxRequests: 30,  // 30 запросов
  windowMs: 60_000, // в минуту
}

/**
 * Проверка rate limit для ключа
 * Возвращает { allowed, remaining, resetAt }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    // Новое окно
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}

/**
 * Получение ключа rate limit из IP и пути
 */
export function getRateLimitKey(ip: string, path: string): string {
  // Для API — более строгий лимит
  if (path.startsWith("/api/")) {
    return `api:${ip}`
  }
  return `general:${ip}`
}

/**
 * Получение конфигурации rate limit для пути
 */
export function getRateLimitConfig(path: string): RateLimitConfig {
  if (path.startsWith("/api/")) {
    return API_CONFIG
  }
  return DEFAULT_CONFIG
}