import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { provisionProject } from "../../../../../packages/orchestrator/src/provisioner"

/**
 * API создания проекта
 * POST /api/projects/create
 *
 * Вызывает Agent-Provisioner напрямую (без HTTP-прокси):
 * 1. Проверки баланса
 * 2. Создания ветки
 * 3. Регистрации домена
 * 4. Создания хостинг-проекта
 * 5. Деплоя
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { projectName, projectType, description, customDomain } = body

    if (!projectName || !projectType) {
      return NextResponse.json({ error: "Название и тип проекта обязательны" }, { status: 400 })
    }

    // Создаём запись проекта в БД
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const { error: insertError } = await supabase
      .from("projects")
      .insert({
        id: projectId,
        user_id: user.id,
        name: projectName,
        type: projectType,
        description: description || "",
        status: "provisioning",
        created_at: new Date().toISOString(),
      })

    if (insertError) {
      console.warn("[Projects API] Insert warning:", insertError.message)
    }

    // Вызываем Agent-Provisioner напрямую (без HTTP-запроса к тому же приложению)
    const provisionResult = await provisionProject({
      userId: user.id,
      projectId,
      projectName,
      projectType,
      planId: "starter",
      customDomain: customDomain || undefined,
    })

    if (!provisionResult.success) {
      if (provisionResult.balanceCheck && !provisionResult.balanceCheck.canPublish) {
        return NextResponse.json({
          error: provisionResult.error || "Недостаточно средств",
          redirectToBilling: true,
          balanceCheck: provisionResult.balanceCheck,
        }, { status: 402 })
      }

      return NextResponse.json({
        error: provisionResult.error || "Ошибка создания инфраструктуры",
      }, { status: 500 })
    }

    // Обновляем статус проекта
    await supabase
      .from("projects")
      .update({
        status: "active",
        subdomain: provisionResult.subdomain,
        vercel_project_id: provisionResult.vercelProjectId,
        deployment_url: provisionResult.deploymentResult?.deploymentUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)

    return NextResponse.json({
      success: true,
      projectId,
      subdomain: provisionResult.subdomain,
      deploymentUrl: provisionResult.deploymentResult?.deploymentUrl,
      projectUrl: provisionResult.hostingResult?.projectUrl,
    })
  } catch (error) {
    console.error("[Projects API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}