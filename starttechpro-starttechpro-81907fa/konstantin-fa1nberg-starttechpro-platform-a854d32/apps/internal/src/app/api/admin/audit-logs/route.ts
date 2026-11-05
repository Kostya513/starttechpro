import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

/**
 * API аудит-логов
 * GET /api/admin/audit-logs — список логов
 */
export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      logs: (logs || []).map((l) => ({
        id: l.id,
        userId: l.user_id,
        action: l.action,
        resourceType: l.resource_type,
        resourceId: l.resource_id,
        details: l.details,
        ipAddress: l.ip_address,
        userAgent: l.user_agent,
        createdAt: l.created_at,
      })),
    })
  } catch (error) {
    console.error("[Admin API] Audit logs error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}