/**
 * Cache Service — in-memory кэширование для пакета orchestrator
 *
 * Используется для:
 * - Кэширования тарифов и статических конфигураций
 * - Кэширования результатов частых запросов к БД
 * - Уменьшения нагрузки на Supabase
 *
 * В production: замена на Redis (через Upstash / Redis Cloud)
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class CacheService {
  private store = new Map<string, CacheEntry<unknown>>()
  private defaultTtlMs: number

  constructor(defaultTtlMs: number = 5 * 60 * 1000) { // 5 минут по умолчанию
    this.defaultTtlMs = defaultTtlMs
  }

  /**
   * Получение значения из кэша
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value as T
  }

  /**
   * Сохранение значения в кэш
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs || this.defaultTtlMs),
    })
  }

  /**
   * Удаление значения из кэша
   */
  delete(key: string): void {
    this.store.delete(key)
  }

  /**
   * Очистка всего кэша
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Очистка просроченных записей
   */
  cleanup(): number {
    const now = Date.now()
    let deleted = 0
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
        deleted++
      }
    }
    return deleted
  }

  /**
   * Получение значения с функцией-генератором (cache-aside pattern)
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) return cached

    const value = await fetcher()
    this.set(key, value, ttlMs)
    return value
  }

  /**
   * Размер кэша
   */
  get size(): number {
    return this.store.size
  }
}

// Глобальный экземпляр кэша
export const cache = new CacheService()

// Ключи кэша
export const CacheKeys = {
  wallet: (userId: string) => `wallet:${userId}`,
  planPrices: "plans:prices",
  projectStats: (userId: string) => `project:stats:${userId}`,
  subscriptionTiers: "subscription:tiers",
  analyticsMetrics: (projectId: string, period: string) => `analytics:${projectId}:${period}`,
} as const