import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

/**
 * API задач админ-панели
 * GET /api/admin/tasks — список задач
 * POST /api/admin/tasks — создание задачи
 */
export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      tasks: (tasks || []).map((t) => ({
        id: t.id,
        projectId: t.project_id,
        userId: t.user_id,
        assigneeId: t.assignee_id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
    })
  } catch (error) {
    console.error("[Admin API] Tasks error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { title, description, priority, assigneeId, projectId, dueDate } = body

    if (!title) {
      return NextResponse.json({ error: "Название задачи обязательно" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description: description || "",
        priority: priority || "medium",
        assignee_id: assigneeId || null,
        project_id: projectId || null,
        due_date: dueDate || null,
        status: "todo",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task: data }, { status: 201 })
  } catch (error) {
    console.error("[Admin API] Task create error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}