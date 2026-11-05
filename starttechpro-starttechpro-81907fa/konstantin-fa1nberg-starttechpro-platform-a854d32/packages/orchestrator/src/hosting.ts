/**
 * Hosting Service — управление хостингом через Vercel / Cloudflare Pages
 *
 * Архитектура:
 * - Корпоративный аккаунт Vercel Enterprise / Cloudflare Pages
 * - Каждый проект пользователя — изолированный контейнер внутри аккаунта
 * - Клиент НЕ имеет доступа к панели хостинга — только к дашборду StartTechPro
 * - Автоматическое масштабирование, бэкапы, мониторинг uptime
 *
 * Функции:
 * - Создание проекта (Vercel / Cloudflare)
 * - Деплой с tenant-изоляцией
 * - Настройка переменных окружения (secrets)
 * - Мониторинг статуса деплоя
 * - Настройка кастомного домена
 * - Удаление проекта
 */

import { logger } from "./logger"
import type { IHostingApi, HostingApiConfig, HostingProjectConfig, EnvVarApi } from "./interfaces"
import { getCurrentEnvironment } from "./interfaces"
import { createMockHostingApi } from "./mock-apis"

export type HostingProvider = "vercel" | "cloudflare-pages"

export interface HostingConfig {
  provider: HostingProvider
  token: string
  orgId?: string
  teamId?: string
}

export interface ProjectConfig {
  name: string
  framework: "nextjs" | "static" | "node" | "other"
  rootDirectory: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
}

export interface HostingProjectResult {
  success: boolean
  projectId: string
  projectUrl: string
  previewUrl: string
  productionUrl: string
  error?: string
}

export interface DeploymentResult {
  success: boolean
  deploymentId: string
  deploymentUrl: string
  status: "building" | "ready" | "error"
  error?: string
}

export interface EnvVar {
  key: string
  value: string
  target: "production" | "preview" | "development"
  sensitive: boolean
}

// ============================================
// Фабрика API
// ============================================

let hostingApiInstance: IHostingApi | null = null

function getHostingApi(): IHostingApi {
  if (!hostingApiInstance) {
    const env = getCurrentEnvironment()
    if (env === "production") {
      logger.warn("Hosting", "init", "Production Hosting API не реализован, используется mock")
    }
    hostingApiInstance = createMockHostingApi()
  }
  return hostingApiInstance
}

// ============================================
// Публичное API
// ============================================

/**
 * Получение конфигурации хостинга из переменных окружения
 */
function getHostingConfig(): HostingConfig {
  return {
    provider: "vercel",
    token: process.env.VERCEL_TOKEN || "",
    orgId: process.env.VERCEL_ORG_ID,
    teamId: process.env.VERCEL_ORG_ID,
  }
}

/**
 * Создание хостинг-проекта для пользователя
 */
export async function createHostingProject(
  projectName: string,
  tenantId: string,
  framework: ProjectConfig["framework"] = "nextjs"
): Promise<HostingProjectResult> {
  const config = getHostingConfig()
  const api = getHostingApi()
  const safeName = `${tenantId}-${projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40)}`

  const projectConfig: HostingProjectConfig = {
    framework,
    rootDirectory: ".",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm ci",
  }

  const apiConfig: HostingApiConfig = {
    provider: config.provider,
    token: config.token,
    orgId: config.orgId,
    teamId: config.teamId,
  }

  logger.info("Hosting", "create", `Создание хостинг-проекта: ${safeName}`, {
    framework,
    tenantId: tenantId.slice(0, 16),
  })

  return await api.createProject(safeName, projectConfig, apiConfig)
}

/**
 * Деплой проекта с tenant-изоляцией
 */
export async function deployProject(
  projectId: string,
  branchName: string,
  envVars: Record<string, string>,
  tenantId: string
): Promise<DeploymentResult> {
  const config = getHostingConfig()
  const api = getHostingApi()

  const envVarList: EnvVarApi[] = Object.entries(envVars).map(([key, value]) => ({
    key,
    value,
    target: "production" as const,
    sensitive: key.includes("KEY") || key.includes("SECRET") || key.includes("TOKEN") || key.includes("PASS"),
  }))

  envVarList.push({
    key: "NEXT_PUBLIC_TENANT_ID",
    value: tenantId,
    target: "production",
    sensitive: false,
  })

  const apiConfig: HostingApiConfig = {
    provider: config.provider,
    token: config.token,
    orgId: config.orgId,
    teamId: config.teamId,
  }

  logger.info("Hosting", "deploy", `Деплой проекта ${projectId}`, {
    branch: branchName,
    envCount: envVarList.length,
    tenantId: tenantId.slice(0, 16),
  })

  await api.setEnvVars(projectId, envVarList, apiConfig)
  return await api.deploy(projectId, branchName, envVarList, apiConfig)
}

/**
 * Привязка домена к хостинг-проекту
 */
export async function assignDomainToHosting(
  projectId: string,
  domain: string
): Promise<boolean> {
  const config = getHostingConfig()
  const api = getHostingApi()

  const apiConfig: HostingApiConfig = {
    provider: config.provider,
    token: config.token,
    orgId: config.orgId,
    teamId: config.teamId,
  }

  logger.info("Hosting", "assign-domain", `Привязка домена ${domain} к проекту ${projectId}`)

  return await api.assignDomain(projectId, domain, apiConfig)
}

/**
 * Получение статуса деплоя
 */
export async function getDeploymentStatus(
  deploymentId: string
): Promise<"building" | "ready" | "error"> {
  const config = getHostingConfig()
  const api = getHostingApi()

  const apiConfig: HostingApiConfig = {
    provider: config.provider,
    token: config.token,
  }

  return await api.getDeploymentStatus(deploymentId, apiConfig)
}

/**
 * Удаление хостинг-проекта
 */
export async function deleteHostingProject(projectId: string): Promise<boolean> {
  const config = getHostingConfig()
  const api = getHostingApi()

  const apiConfig: HostingApiConfig = {
    provider: config.provider,
    token: config.token,
  }

  logger.info("Hosting", "delete", `Удаление хостинг-проекта: ${projectId}`)

  return await api.deleteProject(projectId, apiConfig)
}