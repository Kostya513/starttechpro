import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { parsePaginationParams, createPaginationResult, getSqlRange } from "@/lib/pagination"

/**
 * API списка проектов пользователя
 * GET /api/projects/list?page=1&pageSize=20
 */
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const url = new URL(request.url)
    const pagination = parsePaginationParams(url.searchParams)

    // Получаем общее количество
    const { count: total } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const range = getSqlRange(pagination)

    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, name, type, description, status, subdomain, deployment_url, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(range.offset, range.offset + range.limit - 1)

    if (error) {
      console.error("[Projects API] List error:", error)
      return NextResponse.json({ error: "Ошибка загрузки проектов" }, { status: 500 })
    }

    return NextResponse.json({
      projects: (projects || []).map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        status: p.status,
        subdomain: p.subdomain,
        deploymentUrl: p.deployment_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })),
      pagination: createPaginationResult(pagination, total || 0),
    })
  } catch (error) {
    console.error("[Projects API] List error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}