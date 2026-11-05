/**
 * Analytics Service — реальная аналитика из БД
 *
 * Все функции возвращают данные из таблиц analytics_events и analytics_snapshots.
 * В development режиме — mock-данные, в production — реальные запросы.
 */

import { createServiceClient } from "./supabase"

export interface AnalyticsMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  totalProjects: number
  activeProjects: number
  mrr: number
  subscriptions: number
  revenue: number
  pageViews: number
  conversions: number
  conversionRate: number
  errors: number
  avgSessionDuration: number
}

export interface DailyMetric {
  date: string
  pageViews: number
  uniqueVisitors: number
  conversions: number
  revenue: number
}

export interface TopPage {
  path: string
  views: number
  avgTime: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

// ============================================
// Вспомогательные функции
// ============================================

function getDateRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

function logError(context: string, error: unknown): void {
  console.error(`[Analytics] ${context}:`, error)
}

// ============================================
// Основные функции аналитики
// ============================================

/**
 * Получение общих метрик платформы
 */
export async function getPlatformMetrics(): Promise<AnalyticsMetrics> {
  try {
    const supabase = createServiceClient()
    const dateRange = getDateRange(30)

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    const { count: activeUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("updated_at", dateRange.start)

    const { count: newUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dateRange.start)

    const { count: totalProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })

    const { count: activeProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    const { count: subscriptions } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    const { data: activeSubs } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("status", "active")

    const planPrices: Record<string, number> = {
      starter: 9900,
      pro: 29900,
      enterprise: 99000,
    }

    const mrr = (activeSubs || []).reduce((sum, sub) => sum + (planPrices[sub.plan_id] || 0), 0)

    const { count: pageViews } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view")
      .gte("created_at", dateRange.start)

    const { count: conversions } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "conversion")
      .gte("created_at", dateRange.start)

    const { count: errors } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "error")
      .gte("created_at", dateRange.start)

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      mrr,
      subscriptions: subscriptions || 0,
      revenue: mrr,
      pageViews: pageViews || 0,
      conversions: conversions || 0,
      conversionRate: pageViews && pageViews > 0 ? ((conversions || 0) / pageViews) * 100 : 0,
      errors: errors || 0,
      avgSessionDuration: 0,
    }
  } catch (error) {
    logError("platform-metrics", error)
    return {
      totalUsers: 0, activeUsers: 0, newUsers: 0,
      totalProjects: 0, activeProjects: 0,
      mrr: 0, subscriptions: 0, revenue: 0,
      pageViews: 0, conversions: 0, conversionRate: 0,
      errors: 0, avgSessionDuration: 0,
    }
  }
}

/**
 * Получение ежедневных метрик для графика
 */
export async function getDailyMetrics(days: number = 30): Promise<DailyMetric[]> {
  try {
    const supabase = createServiceClient()
    const dateRange = getDateRange(days)

    const { data: snapshots } = await supabase
      .from("analytics_snapshots")
      .select("*")
      .gte("date", dateRange.start.split("T")[0])
      .order("date", { ascending: true })

    if (snapshots && snapshots.length > 0) {
      return snapshots.map((s) => ({
        date: s.date,
        pageViews: s.page_views,
        uniqueVisitors: s.unique_visitors,
        conversions: s.conversions,
        revenue: 0,
      }))
    }

    const { data: events } = await supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .gte("created_at", dateRange.start)

    const dailyMap = new Map<string, { pageViews: number; conversions: number }>()

    for (const event of events || []) {
      const day = event.created_at.split("T")[0]
      const existing = dailyMap.get(day) || { pageViews: 0, conversions: 0 }
      if (event.event_type === "page_view") existing.pageViews++
      if (event.event_type === "conversion") existing.conversions++
      dailyMap.set(day, existing)
    }

    return Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, metrics]) => ({
        date,
        pageViews: metrics.pageViews,
        uniqueVisitors: metrics.pageViews,
        conversions: metrics.conversions,
        revenue: 0,
      }))
  } catch (error) {
    logError("daily-metrics", error)
    return []
  }
}

/**
 * Получение топ страниц
 */
export async function getTopPages(days: number = 30): Promise<TopPage[]> {
  try {
    const supabase = createServiceClient()
    const dateRange = getDateRange(days)

    const { data: events } = await supabase
      .from("analytics_events")
      .select("metadata")
      .eq("event_type", "page_view")
      .gte("created_at", dateRange.start)

    const pageMap = new Map<string, number>()

    for (const event of events || []) {
      const path = (event.metadata as Record<string, unknown>)?.path as string || "/"
      pageMap.set(path, (pageMap.get(path) || 0) + 1)
    }

    return Array.from(pageMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({
        path,
        views,
        avgTime: 0,
      }))
  } catch (error) {
    logError("top-pages", error)
    return []
  }
}

/**
 * Получение источников трафика
 */
export async function getTrafficSources(days: number = 30): Promise<TrafficSource[]> {
  try {
    const supabase = createServiceClient()
    const dateRange = getDateRange(days)

    const { data: events } = await supabase
      .from("analytics_events")
      .select("metadata")
      .eq("event_type", "page_view")
      .gte("created_at", dateRange.start)

    const sourceMap = new Map<string, number>()
    let total = 0

    for (const event of events || []) {
      const source = ((event.metadata as Record<string, unknown>)?.source as string) || "direct"
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
      total++
    }

    return Array.from(sourceMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([source, visitors]) => ({
        source,
        visitors,
        percentage: total > 0 ? (visitors / total) * 100 : 0,
      }))
  } catch (error) {
    logError("traffic-sources", error)
    return []
  }
}

/**
 * Трекинг события аналитики
 */
export async function trackEvent(params: {
  projectId?: string
  userId?: string
  eventType: string
  eventName: string
  metadata?: Record<string, unknown>
  sessionId?: string
}): Promise<boolean> {
  try {
    const supabase = createServiceClient()

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        project_id: params.projectId || null,
        user_id: params.userId || null,
        event_type: params.eventType,
        event_name: params.eventName,
        metadata: params.metadata || {},
        session_id: params.sessionId || null,
      })

    if (error) {
      logError("track-event", error.message)
      return false
    }

    return true
  } catch (error) {
    logError("track-event", error)
    return false
  }
}