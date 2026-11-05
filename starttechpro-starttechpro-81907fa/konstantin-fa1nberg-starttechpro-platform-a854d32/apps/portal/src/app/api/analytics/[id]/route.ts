import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API получения метрик аналитики
 * GET /api/analytics/[projectId]?period=7d|30d|90d
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, что проект принадлежит пользователю
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 })
    }

    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "30d"

    // Определяем дату начала
    const now = new Date()
    let startDate: Date
    switch (period) {
      case "7d": startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break
      case "90d": startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break
      default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Получаем снимки метрик за период
    const { data: snapshots } = await supabase
      .from("analytics_snapshots")
      .select("*")
      .eq("project_id", id)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", now.toISOString().split("T")[0])
      .order("date", { ascending: true })

    // Получаем сырые события за период
    const { data: events } = await supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .eq("project_id", id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", now.toISOString())

    // Агрегируем данные
    const totalPageViews = events?.filter((e) => e.event_type === "page_view").length || 0
    const totalConversions = events?.filter((e) => e.event_type === "conversion").length || 0
    const totalErrors = events?.filter((e) => e.event_type === "error").length || 0
    const totalApiCalls = events?.filter((e) => e.event_type === "api_call").length || 0
    const totalAiRequests = events?.filter((e) => e.event_type === "ai_request").length || 0

    // Группировка по дням для графиков
    const dailyStats = (snapshots || []).map((s) => ({
      date: s.date,
      pageViews: s.page_views,
      uniqueVisitors: s.unique_visitors,
      conversions: s.conversions,
      errors: s.errors,
      avgSessionDuration: s.avg_session_duration_seconds,
      bounceRate: s.bounce_rate,
    }))

    return NextResponse.json({
      period,
      total: {
        pageViews: totalPageViews,
        conversions: totalConversions,
        errors: totalErrors,
        apiCalls: totalApiCalls,
        aiRequests: totalAiRequests,
        conversionRate: totalPageViews > 0 ? ((totalConversions / totalPageViews) * 100).toFixed(2) : "0.00",
      },
      daily: dailyStats,
      topPages: snapshots?.[snapshots.length - 1]?.top_pages || [],
      trafficSources: snapshots?.[snapshots.length - 1]?.traffic_sources || [],
    })
  } catch (error) {
    console.error("[Analytics API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}