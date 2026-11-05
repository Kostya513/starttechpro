import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API получения истории версий проекта
 * GET /api/live-editor/versions?projectId=xxx
 */
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "projectId обязателен" }, { status: 400 })
    }

    // Проверяем, что проект принадлежит пользователю
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 })
    }

    const { data: versions, error } = await supabase
      .from("project_versions")
      .select("*")
      .eq("project_id", projectId)
      .order("version_number", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Ошибка загрузки версий" }, { status: 500 })
    }

    return NextResponse.json({
      versions: (versions || []).map((v) => ({
        id: v.id,
        projectId: v.project_id,
        versionNumber: v.version_number,
        parentVersionId: v.parent_version_id,
        branch: v.branch,
        title: v.title,
        description: v.description,
        author: v.author,
        agentName: v.agent_name,
        status: v.status,
        files: v.files,
        createdAt: v.created_at,
      })),
    })
  } catch (error) {
    console.error("[LiveEditor API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}