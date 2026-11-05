/**
 * Domain Service — управление доменами через API регистраторов
 *
 * Поддерживаемые провайдеры:
 * - Reg.ru (рекомендуемый для .RU, .РФ)
 * - Cloudflare Registrar (для .COM, международные)
 *
 * Функции:
 * - Регистрация домена
 * - Настройка DNS-записей (CNAME, A, MX)
 * - Автоматический SSL (Let's Encrypt / Cloudflare)
 * - Проверка whois / доступности домена
 * - Привязка кастомного домена клиента (CNAME-верификация)
 */

import { logger } from "./logger"
import type { IDomainApi, DomainApiConfig, DnsRecordApi } from "./interfaces"
import { getCurrentEnvironment, type Environment } from "./interfaces"
import { createMockDomainApi } from "./mock-apis"

export type DomainProvider = "regru" | "cloudflare"

export interface DomainConfig {
  provider: DomainProvider
  apiKey: string
  apiUrl?: string
}

export interface DomainRegistrationRequest {
  domain: string
  projectId: string
  userId: string
  targetIp?: string
  targetCname?: string
}

export interface DomainRegistrationResult {
  success: boolean
  domain: string
  dnsRecords: Array<{ type: string; name: string; value: string }>
  sslStatus: "pending" | "active" | "failed"
  nameservers: string[]
  expiresAt: string
  error?: string
}

export interface DnsRecord {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS"
  name: string
  value: string
  ttl?: number
  priority?: number
}

// ============================================
// Конфигурация DNS по умолчанию
// ============================================

const DEFAULT_DNS_RECORDS = (subdomain: string, targetCname: string): DnsRecord[] => [
  { type: "CNAME", name: subdomain, value: targetCname, ttl: 600 },
  { type: "CNAME", name: `www.${subdomain}`, value: targetCname, ttl: 600 },
  { type: "TXT", name: subdomain, value: "v=spf1 include:_spf.starttechpro.ru ~all", ttl: 3600 },
]

// ============================================
// Фабрика API
// ============================================

let domainApiInstance: IDomainApi | null = null

function getDomainApi(): IDomainApi {
  if (!domainApiInstance) {
    const env = getCurrentEnvironment()
    if (env === "production") {
      // В production: создаём реальную реализацию (будет добавлена позже)
      // domainApiInstance = new ProductionDomainApi()
      logger.warn("Domain", "init", "Production Domain API не реализован, используется mock")
    }
    domainApiInstance = createMockDomainApi()
  }
  return domainApiInstance
}

// ============================================
// Публичное API
// ============================================

/**
 * Получение конфигурации регистратора из переменных окружения
 */
function getDomainConfig(): DomainConfig {
  const provider = (process.env.DOMAIN_REGISTRAR_PROVIDER || "regru") as DomainProvider
  return {
    provider,
    apiKey: process.env.DOMAIN_REGISTRAR_API_KEY || "",
  }
}

/**
 * Регистрация домена для проекта
 */
export async function registerDomain(
  request: DomainRegistrationRequest
): Promise<DomainRegistrationResult> {
  const config = getDomainConfig()
  const api = getDomainApi()

  const isRuZone = request.domain.endsWith(".ru") || request.domain.endsWith(".рф")
  const provider: DomainProvider = isRuZone ? "regru" : "cloudflare"

  logger.info("Domain", "register", `Регистрация домена: ${request.domain} (${provider})`, {
    projectId: request.projectId,
    userId: request.userId.slice(0, 8),
  })

  const apiConfig: DomainApiConfig = {
    provider,
    apiKey: config.apiKey,
  }

  const result = await api.registerDomain(request.domain, apiConfig)

  if (result.success) {
    const ssl = await api.provisionSsl(request.domain)
    const sslStatus = ssl.success ? "active" : "failed"

    logger.info("Domain", "register-success", `Домен ${request.domain} зарегистрирован`, {
      sslStatus,
      nameservers: result.nameservers,
    })

    return {
      success: true,
      domain: request.domain,
      dnsRecords: DEFAULT_DNS_RECORDS(request.domain, `proxy.starttechpro.ru`),
      sslStatus,
      nameservers: result.nameservers,
      expiresAt: result.expiresAt,
    }
  }

  logger.error("Domain", "register-failed", `Ошибка регистрации домена ${request.domain}`, {
    error: result.error,
  })

  return {
    success: false,
    domain: request.domain,
    dnsRecords: [],
    sslStatus: "failed",
    nameservers: [],
    expiresAt: "",
    error: result.error,
  }
}

/**
 * Настройка DNS для поддомена starttechpro.ru
 */
export async function configureSubdomainDns(
  subdomain: string,
  targetCname: string
): Promise<{
  success: boolean
  records: DnsRecord[]
  error?: string
}> {
  try {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID
    const api = getDomainApi()
    const config = getDomainConfig()

    const records = DEFAULT_DNS_RECORDS(subdomain, targetCname)

    logger.info("Domain", "dns-configure", `Настройка DNS для ${subdomain}`, {
      recordsCount: records.length,
      targetCname,
    })

    if (zoneId) {
      const apiConfig: DomainApiConfig = {
        provider: "cloudflare",
        apiKey: config.apiKey,
      }
      await api.createDnsRecords(zoneId, records as DnsRecordApi[], apiConfig)
    }

    return { success: true, records }
  } catch (error) {
    logger.error("Domain", "dns-error", `Ошибка настройки DNS для ${subdomain}`, { error: String(error) })
    return { success: false, records: [], error: String(error) }
  }
}

/**
 * Проверка и привязка кастомного домена клиента
 */
export async function attachCustomDomain(
  customDomain: string,
  projectSubdomain: string
): Promise<{
  success: boolean
  verificationStatus: "pending" | "verified" | "failed"
  sslStatus: "pending" | "active"
  error?: string
}> {
  try {
    const api = getDomainApi()

    logger.info("Domain", "attach-custom", `Привязка кастомного домена: ${customDomain}`, {
      projectSubdomain,
    })

    const cnameVerified = await api.verifyCnameRecord(customDomain, projectSubdomain)

    if (!cnameVerified) {
      logger.warn("Domain", "cname-pending", `CNAME для ${customDomain} не найден`)
      return {
        success: false,
        verificationStatus: "pending",
        sslStatus: "pending",
        error: "CNAME-запись не найдена. Убедитесь, что вы настроили CNAME на вашем DNS-хостинге.",
      }
    }

    const ssl = await api.provisionSsl(customDomain)

    logger.info("Domain", "attach-success", `Кастомный домен ${customDomain} привязан`, {
      sslStatus: ssl.success ? "active" : "pending",
    })

    return {
      success: true,
      verificationStatus: "verified",
      sslStatus: ssl.success ? "active" : "pending",
    }
  } catch (error) {
    logger.error("Domain", "attach-error", `Ошибка привязки домена ${customDomain}`, { error: String(error) })
    return {
      success: false,
      verificationStatus: "failed",
      sslStatus: "pending",
      error: String(error),
    }
  }
}

/**
 * Удаление домена (при депровижининге)
 */
export async function deleteDomain(domain: string): Promise<boolean> {
  const api = getDomainApi()
  const config = getDomainConfig()

  logger.info("Domain", "delete", `Удаление домена: ${domain}`)

  const apiConfig: DomainApiConfig = {
    provider: config.provider,
    apiKey: config.apiKey,
  }

  return await api.deleteDomain(domain, apiConfig)
}