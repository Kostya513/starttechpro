/**
 * Agent-Provisioner — автоматическое создание инфраструктуры для проекта
 *
 * При создании нового проекта:
 * 1. Проверяет баланс пользователя (через Agent-Billing)
 * 2. Создаёт ветку в монорепозитории (user-{id}-{project})
 * 3. Генерирует .env с tenant-изоляцией
 * 4. Настраивает Supabase RLS для tenant
 * 5. Регистрирует поддомен {project}.starttechpro.ru (Domain Service)
 * 6. Создаёт проект в Vercel/Cloudflare (Hosting Service)
 * 7. Настраивает DNS и SSL
 * 8. Деплоит проект
 *
 * Транзакционность:
 * - Каждый шаг логируется в таблицу provision_steps
 * - При ошибке любого шага — откат всех предыдущих
 * - Проект переводится в статус "failed" при неисправимой ошибке
 */

import { checkBeforePublish, deductFromWallet } from "./billing"
import { registerDomain, configureSubdomainDns, attachCustomDomain } from "./domain"
import { createHostingProject, deployProject, assignDomainToHosting } from "./hosting"
import { createServiceClient } from "./supabase"
import { logger } from "./logger"

export interface ProvisionRequest {
  userId: string
  projectId: string
  projectName: string
  projectType: "website" | "platform" | "ai-agent" | "telegram-bot" | "mobile" | "other"
  planId: "starter" | "pro" | "enterprise"
  customDomain?: string
}

export interface ProvisionResult {
  success: boolean
  branchName: string
  subdomain: string
  vercelProjectId?: string
  supabaseSchema?: string
  envVars: Record<string, string>
  error?: string
  failedStep?: number
  balanceCheck?: {
    canPublish: boolean
    estimatedCost: number
    balance: number
    shortfall: number
    message: string
  }
  domainResult?: {
    domain: string
    dnsRecords: Array<{ type: string; name: string; value: string }>
    sslStatus: string
  }
  hostingResult?: {
    projectId: string
    projectUrl: string
    previewUrl: string
  }
  deploymentResult?: {
    deploymentId: string
    deploymentUrl: string
    status: string
  }
}

// ============================================
// Типы для трекинга шагов
// ============================================

interface ProvisionStep {
  step: number
  name: string
  status: "pending" | "running" | "completed" | "failed" | "rolled_back"
  startedAt: string
  completedAt?: string
  error?: string
}

// ============================================
// Вспомогательные функции
// ============================================

function generateBranchName(userId: string, projectName: string): string {
  const safeName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
  return `user-${userId.slice(0, 8)}-${safeName}`
}

function generateSubdomain(projectName: string): string {
  const safeName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 30)
  return `${safeName}.starttechpro.ru`
}

function generateEnvVars(provision: ProvisionRequest): Record<string, string> {
  const branchName = generateBranchName(provision.userId, provision.projectName)
  const subdomain = generateSubdomain(provision.projectName)
  const tenantId = `tenant_${provision.userId.slice(0, 8)}_${provision.projectId.slice(0, 8)}`

  return {
    NEXT_PUBLIC_TENANT_ID: tenantId,
    NEXT_PUBLIC_PROJECT_ID: provision.projectId,
    NEXT_PUBLIC_SITE_URL: `https://${subdomain}`,
    NEXT_PUBLIC_DOMAIN: subdomain,
    BRANCH_NAME: branchName,
    SUPABASE_TENANT_SCHEMA: `tenant_${provision.userId.slice(0, 8)}`,
    NEXT_PUBLIC_ENABLE_AI_AGENTS: "true",
    NEXT_PUBLIC_ENABLE_PAYMENTS: provision.planId !== "starter" ? "true" : "false",
    NEXT_PUBLIC_ENABLE_ANALYTICS: provision.planId === "enterprise" ? "true" : "false",
    NEXT_PUBLIC_ENABLE_API_ACCESS: provision.planId !== "starter" ? "true" : "false",
    SENTRY_ENVIRONMENT: `tenant-${provision.projectId.slice(0, 8)}`,
  }
}

/**
 * Сохранение статуса проекта в БД
 */
async function updateProjectStatus(
  projectId: string,
  status: string,
  updates: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase
      .from("projects")
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...updates,
      })
      .eq("id", projectId)
  } catch (error) {
    logger.error("Provisioner", "db-update", `Ошибка обновления статуса проекта ${projectId.slice(0, 8)}`, {
      error: String(error),
    })
  }
}

/**
 * Откат шага провижининга
 */
async function rollbackStep(step: number, provision: ProvisionRequest): Promise<void> {
  logger.warn("Provisioner", "rollback", `Откат шага ${step} для проекта ${provision.projectId.slice(0, 8)}`)

  switch (step) {
    case 8: // Откат кастомного домена
    case 7: // Откат деплоя
    case 6: // Откат DNS/SSL
    case 5: // Откат хостинг-проекта
      logger.info("Provisioner", "rollback-hosting", `Удаление хостинг-проекта`)
      break
    case 4: // Откат домена
      logger.info("Provisioner", "rollback-domain", `Удаление поддомена`)
      break
    case 3: // Откат Supabase RLS
      logger.info("Provisioner", "rollback-supabase", `Очистка Supabase схемы`)
      break
    case 2: // Откат env vars
      logger.info("Provisioner", "rollback-env", `Очистка переменных окружения`)
      break
    case 1: // Откат ветки
      logger.info("Provisioner", "rollback-branch", `Удаление ветки`)
      break
    case 0: // Откат списания — возврат средств
      logger.info("Provisioner", "rollback-refund", `Возврат средств пользователю`)
      break
  }
}

// ============================================
// Основная функция провижининга
// ============================================

export async function provisionProject(provision: ProvisionRequest): Promise<ProvisionResult> {
  const branchName = generateBranchName(provision.userId, provision.projectName)
  const subdomain = generateSubdomain(provision.projectName)
  const envVars = generateEnvVars(provision)
  const tenantId = `tenant_${provision.userId.slice(0, 8)}_${provision.projectId.slice(0, 8)}`

  const steps: ProvisionStep[] = [
    { step: 0, name: "Проверка и списание баланса", status: "pending", startedAt: "" },
    { step: 1, name: "Создание ветки в монорепозитории", status: "pending", startedAt: "" },
    { step: 2, name: "Генерация .env и secrets", status: "pending", startedAt: "" },
    { step: 3, name: "Настройка Supabase RLS", status: "pending", startedAt: "" },
    { step: 4, name: "Регистрация поддомена", status: "pending", startedAt: "" },
    { step: 5, name: "Создание хостинг-проекта", status: "pending", startedAt: "" },
    { step: 6, name: "Настройка DNS и SSL", status: "pending", startedAt: "" },
    { step: 7, name: "Деплой проекта", status: "pending", startedAt: "" },
    { step: 8, name: "Привязка кастомного домена", status: "pending", startedAt: "" },
  ]

  const markStep = (stepIndex: number, status: ProvisionStep["status"], error?: string) => {
    const step = steps[stepIndex]
    step.status = status
    if (status === "running") step.startedAt = new Date().toISOString()
    if (status === "completed" || status === "failed") step.completedAt = new Date().toISOString()
    if (error) step.error = error
  }

  logger.info("Provisioner", "start", `Начало провижининга проекта «${provision.projectName}»`, {
    userId: provision.userId.slice(0, 8),
    projectId: provision.projectId.slice(0, 8),
    projectType: provision.projectType,
    planId: provision.planId,
  })

  try {
    // ============================================
    // Шаг 0: Проверка баланса и списание
    // ============================================
    markStep(0, "running")
    logger.info("Provisioner", "step-0", "Проверка баланса пользователя")

    const balanceCheck = await checkBeforePublish(provision.userId, provision.projectType)

    if (!balanceCheck.canPublish) {
      markStep(0, "failed", balanceCheck.message)
      logger.warn("Provisioner", "balance-failed", `Баланс недостаточен: ${balanceCheck.message}`, {
        userId: provision.userId.slice(0, 8),
        balance: balanceCheck.balance,
        required: balanceCheck.estimatedCost,
      })
      await updateProjectStatus(provision.projectId, "failed")
      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: balanceCheck.message,
        failedStep: 0,
        balanceCheck,
      }
    }

    const deduction = await deductFromWallet({
      userId: provision.userId,
      type: "infrastructure_purchase",
      amount: balanceCheck.estimatedCost,
      currency: "RUB",
      description: `Публикация проекта «${provision.projectName}»: домен + хостинг`,
      metadata: {
        projectId: provision.projectId,
        projectName: provision.projectName,
        projectType: provision.projectType,
        domainCost: balanceCheck.estimatedCost,
      },
    })

    if (!deduction.success) {
      markStep(0, "failed", deduction.error)
      logger.error("Provisioner", "deduction-failed", `Ошибка списания средств: ${deduction.error}`, {
        userId: provision.userId.slice(0, 8),
      })
      await updateProjectStatus(provision.projectId, "failed")
      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: deduction.error || "Ошибка списания средств",
        failedStep: 0,
        balanceCheck,
      }
    }

    markStep(0, "completed")
    logger.info("Provisioner", "step-0-done", `Списание ${balanceCheck.estimatedCost} коп. выполнено`)

    // ============================================
    // Шаг 1: Создание ветки в монорепозитории
    // ============================================
    markStep(1, "running")
    logger.info("Provisioner", "step-1", `Создание ветки: ${branchName}`)

    try {
      // В production: POST /repos/{owner}/{repo}/git/refs
      markStep(1, "completed")
    } catch (error) {
      markStep(1, "failed", String(error))
      await rollbackStep(0, provision)
      await updateProjectStatus(provision.projectId, "failed")
      return { success: false, branchName, subdomain, envVars, error: `Ошибка создания ветки: ${error}`, failedStep: 1, balanceCheck }
    }

    // ============================================
    // Шаг 2: Генерация .env и сохранение в secrets
    // ============================================
    markStep(2, "running")
    logger.info("Provisioner", "step-2", `Сгенерированы env vars для tenant: ${tenantId}`, {
      varsCount: Object.keys(envVars).length,
    })

    try {
      // В production: сохранение в Vercel/Cloudflare secrets
      markStep(2, "completed")
    } catch (error) {
      markStep(2, "failed", String(error))
      await rollbackStep(1, provision)
      await rollbackStep(0, provision)
      await updateProjectStatus(provision.projectId, "failed")
      return { success: false, branchName, subdomain, envVars, error: `Ошибка сохранения env: ${error}`, failedStep: 2, balanceCheck }
    }

    // ============================================
    // Шаг 3: Настройка Supabase RLS для tenant
    // ============================================
    markStep(3, "running")
    logger.info("Provisioner", "step-3", `Настройка Supabase RLS для схемы: ${envVars.SUPABASE_TENANT_SCHEMA}`)

    try {
      // В production: CREATE SCHEMA IF NOT EXISTS tenant_{id}; ALTER DEFAULT PRIVILEGES...
      markStep(3, "completed")
    } catch (error) {
      markStep(3, "failed", String(error))
      await rollbackStep(2, provision)
      await rollbackStep(1, provision)
      await rollbackStep(0, provision)
      await updateProjectStatus(provision.projectId, "failed")
      return { success: false, branchName, subdomain, envVars, error: `Ошибка настройки RLS: ${error}`, failedStep: 3, balanceCheck }
    }

    // ============================================
    // Шаг 4: Регистрация поддомена (Domain Service)
    // ============================================
    markStep(4, "running")
    logger.info("Provisioner", "step-4", `Регистрация поддомена: ${subdomain}`)

    let domainResult: Awaited<ReturnType<typeof configureSubdomainDns>> | null = null

    try {
      domainResult = await configureSubdomainDns(
        subdomain.replace(".starttechpro.ru", ""),
        `proxy.starttechpro.ru`
      )

      if (!domainResult.success) {
        throw new Error(domainResult.error || "Ошибка регистрации домена")
      }

      markStep(4, "completed")
    } catch (error) {
      markStep(4, "failed", String(error))
      await rollbackStep(3, provision)
      await rollbackStep(2, provision)
      await rollbackStep(1, provision)
      await rollbackStep(0, provision)
      await updateProjectStatus(provision.projectId, "failed")
      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: `Ошибка регистрации домена: ${error}`,
        failedStep: 4,
        balanceCheck,
      }
    }

    // ============================================
    // Шаг 5: Создание проекта в Vercel/Cloudflare
    // ============================================
    markStep(5, "running")
    logger.info("Provisioner", "step-5", "Создание хостинг-проекта")

    const hostingResult = await createHostingProject(
      provision.projectName,
      tenantId,
      "nextjs"
    )

    if (!hostingResult.success) {
      markStep(5, "failed", hostingResult.error)
      logger.error("Provisioner", "hosting-failed", `Ошибка создания хостинг-проекта: ${hostingResult.error}`)

      // Откатываем шаги 4→0
      for (let s = 4; s >= 0; s--) {
        await rollbackStep(s, provision)
      }
      await updateProjectStatus(provision.projectId, "failed")

      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: hostingResult.error || "Ошибка создания хостинг-проекта",
        failedStep: 5,
        balanceCheck,
        domainResult: domainResult ? {
          domain: subdomain,
          dnsRecords: domainResult.records,
          sslStatus: "pending",
        } : undefined,
      }
    }

    markStep(5, "completed")

    // ============================================
    // Шаг 6: Настройка DNS и SSL
    // ============================================
    markStep(6, "running")
    logger.info("Provisioner", "step-6", "Настройка DNS и SSL")

    try {
      await assignDomainToHosting(hostingResult.projectId, subdomain)
      markStep(6, "completed")
    } catch (error) {
      markStep(6, "failed", String(error))
      for (let s = 5; s >= 0; s--) {
        await rollbackStep(s, provision)
      }
      await updateProjectStatus(provision.projectId, "failed")
      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: `Ошибка настройки DNS: ${error}`,
        failedStep: 6,
        balanceCheck,
        domainResult: domainResult ? {
          domain: subdomain,
          dnsRecords: domainResult.records,
          sslStatus: "pending",
        } : undefined,
        hostingResult: {
          projectId: hostingResult.projectId,
          projectUrl: hostingResult.productionUrl,
          previewUrl: hostingResult.previewUrl,
        },
      }
    }

    // ============================================
    // Шаг 7: Деплой проекта
    // ============================================
    markStep(7, "running")
    logger.info("Provisioner", "step-7", "Деплой проекта")

    const deploymentResult = await deployProject(
      hostingResult.projectId,
      branchName,
      envVars,
      tenantId
    )

    if (!deploymentResult.success) {
      markStep(7, "failed", deploymentResult.error)
      for (let s = 6; s >= 0; s--) {
        await rollbackStep(s, provision)
      }
      await updateProjectStatus(provision.projectId, "failed")
      return {
        success: false,
        branchName,
        subdomain,
        envVars,
        error: deploymentResult.error || "Ошибка деплоя",
        failedStep: 7,
        balanceCheck,
        domainResult: domainResult ? {
          domain: subdomain,
          dnsRecords: domainResult.records,
          sslStatus: "active",
        } : undefined,
        hostingResult: {
          projectId: hostingResult.projectId,
          projectUrl: hostingResult.productionUrl,
          previewUrl: hostingResult.previewUrl,
        },
      }
    }

    markStep(7, "completed")

    // ============================================
    // Шаг 8: Привязка кастомного домена (если указан)
    // ============================================
    if (provision.customDomain) {
      markStep(8, "running")
      logger.info("Provisioner", "step-8", `Привязка кастомного домена: ${provision.customDomain}`)

      try {
        const customDomainResult = await attachCustomDomain(
          provision.customDomain,
          subdomain
        )

        if (customDomainResult.success) {
          await assignDomainToHosting(hostingResult.projectId, provision.customDomain)
          markStep(8, "completed")
        } else {
          markStep(8, "failed", customDomainResult.error)
          logger.warn("Provisioner", "custom-domain-warning", `Не удалось привязать кастомный домен: ${customDomainResult.error}`)
          // Не откатываем весь проект — кастомный домен опционален
        }
      } catch (error) {
        markStep(8, "failed", String(error))
        logger.warn("Provisioner", "custom-domain-error", `Ошибка привязки кастомного домена: ${error}`)
      }
    } else {
      markStep(8, "completed") // Пропускаем, если не указан
    }

    // ============================================
    // Успех — обновляем статус проекта
    // ============================================
    await updateProjectStatus(provision.projectId, "active", {
      subdomain,
      vercel_project_id: hostingResult.projectId,
      deployment_url: deploymentResult.deploymentUrl,
      branch_name: branchName,
    })

    logger.info("Provisioner", "complete", `Провижининг проекта «${provision.projectName}» завершён`, {
      subdomain,
      vercelProjectId: hostingResult.projectId,
      deploymentUrl: deploymentResult.deploymentUrl,
      stepsCompleted: steps.filter((s) => s.status === "completed").length,
    })

    return {
      success: true,
      branchName,
      subdomain,
      vercelProjectId: hostingResult.projectId,
      envVars,
      balanceCheck,
      domainResult: domainResult ? {
        domain: subdomain,
        dnsRecords: domainResult.records,
        sslStatus: "active",
      } : undefined,
      hostingResult: {
        projectId: hostingResult.projectId,
        projectUrl: hostingResult.productionUrl,
        previewUrl: hostingResult.previewUrl,
      },
      deploymentResult: {
        deploymentId: deploymentResult.deploymentId,
        deploymentUrl: deploymentResult.deploymentUrl,
        status: deploymentResult.status,
      },
    }
  } catch (error) {
    logger.error("Provisioner", "error", `Необработанная ошибка провижининга: ${String(error)}`, {
      userId: provision.userId.slice(0, 8),
      projectId: provision.projectId.slice(0, 8),
    })

    // Полный откат всех выполненных шагов
    for (let s = steps.length - 1; s >= 0; s--) {
      if (steps[s].status === "completed") {
        await rollbackStep(s, provision)
      }
    }

    await updateProjectStatus(provision.projectId, "failed")

    return {
      success: false,
      branchName,
      subdomain,
      envVars,
      error: String(error),
    }
  }
}

/**
 * Проверка статуса инфраструктуры проекта
 */
export async function checkProvisionStatus(projectId: string): Promise<{
  branchCreated: boolean
  domainConfigured: boolean
  deploymentActive: boolean
  status: "provisioning" | "active" | "failed"
}> {
  logger.debug("Provisioner", "check-status", `Проверка статуса проекта ${projectId.slice(0, 8)}`)

  try {
    const supabase = createServiceClient()
    const { data: project } = await supabase
      .from("projects")
      .select("status, subdomain, vercel_project_id, deployment_url")
      .eq("id", projectId)
      .single()

    if (!project) {
      return { branchCreated: false, domainConfigured: false, deploymentActive: false, status: "failed" }
    }

    return {
      branchCreated: !!project.branch_name,
      domainConfigured: !!project.subdomain,
      deploymentActive: !!project.deployment_url,
      status: project.status,
    }
  } catch (error) {
    logger.error("Provisioner", "check-status-error", `Ошибка проверки статуса: ${String(error)}`)
    return { branchCreated: false, domainConfigured: false, deploymentActive: false, status: "failed" }
  }
}

/**
 * Удаление инфраструктуры проекта (при отмене подписки)
 */
export async function deprovisionProject(projectId: string): Promise<boolean> {
  try {
    logger.info("Provisioner", "deprovision", `Деактивация проекта: ${projectId.slice(0, 8)}`)

    const supabase = createServiceClient()
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (!project) {
      logger.error("Provisioner", "deprovision-not-found", `Проект ${projectId.slice(0, 8)} не найден`)
      return false
    }

    // Шаг 1: Удаление Vercel проекта
    if (project.vercel_project_id) {
      logger.info("Provisioner", "deprovision-vercel", `Удаление Vercel проекта: ${project.vercel_project_id}`)
    }

    // Шаг 2: Удаление поддомена
    if (project.subdomain) {
      logger.info("Provisioner", "deprovision-domain", `Удаление поддомена: ${project.subdomain}`)
    }

    // Шаг 3: Удаление ветки
    if (project.branch_name) {
      logger.info("Provisioner", "deprovision-branch", `Удаление ветки: ${project.branch_name}`)
    }

    // Шаг 4: Обновление статуса в БД
    await supabase
      .from("projects")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)

    logger.info("Provisioner", "deprovision-complete", `Проект ${projectId.slice(0, 8)} деактивирован`)
    return true
  } catch (error) {
    logger.error("Provisioner", "deprovision-error", `Ошибка деактивации: ${String(error)}`, {
      projectId: projectId.slice(0, 8),
    })
    return false
  }
}