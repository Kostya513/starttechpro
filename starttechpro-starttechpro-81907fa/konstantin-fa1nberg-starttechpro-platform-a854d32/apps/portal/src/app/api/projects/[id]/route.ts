import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API получения статуса проекта
 * GET /api/projects/[id]
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

    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: "Проект не найден" }, { status: 404 })
    }

    return NextResponse.json({
      id: project.id,
      name: project.name,
      type: project.type,
      description: project.description,
      status: project.status,
      subdomain: project.subdomain,
      customDomain: project.custom_domain,
      deploymentUrl: project.deployment_url,
      vercelProjectId: project.vercel_project_id,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    })
  } catch (error) {
    console.error("[Projects API] Get error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}