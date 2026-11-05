import { NextResponse } from "next/server"
import { provisionProject } from "../../../../../../packages/orchestrator/src/provisioner"

/**
 * API оркестратора для провижининга инфраструктуры
 * POST /api/orchestrator/provision
 *
 * Вызывается из /api/projects/create после проверки авторизации
 * Использует service_role key для аутентификации
 */
export async function POST(request: Request) {
  try {
    // Проверяем service_role key (межсервисная аутентификация)
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, projectId, projectName, projectType, planId, customDomain } = body

    if (!userId || !projectId || !projectName || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Вызываем Agent-Provisioner
    const result = await provisionProject({
      userId,
      projectId,
      projectName,
      projectType,
      planId: planId || "starter",
      customDomain: customDomain || undefined,
    })

    if (!result.success) {
      // Проверяем, связана ли ошибка с балансом
      if (result.balanceCheck && !result.balanceCheck.canPublish) {
        return NextResponse.json({
          error: result.error,
          insufficientBalance: true,
          balanceCheck: result.balanceCheck,
        }, { status: 402 })
      }

      return NextResponse.json({
        error: result.error || "Provisioning failed",
      }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[Orchestrator API] Provision error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}