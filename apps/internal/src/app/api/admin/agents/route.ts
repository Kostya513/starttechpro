import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

/**
 * API выполнений AI-агентов
 * GET /api/admin/agents — список выполнений
 */
export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: executions, error } = await supabase
      .from("agent_executions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      executions: (executions || []).map((e) => ({
        id: e.id,
        projectId: e.project_id,
        userId: e.user_id,
        agentName: e.agent_name,
        status: e.status,
        input: e.input,
        output: e.output,
        errorMessage: e.error_message,
        startedAt: e.started_at,
        completedAt: e.completed_at,
        durationSeconds: e.duration_seconds,
        tokensUsed: e.tokens_used,
        cost: e.cost,
        createdAt: e.created_at,
      })),
    })
  } catch (error) {
    console.error("[Admin API] Agents error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}