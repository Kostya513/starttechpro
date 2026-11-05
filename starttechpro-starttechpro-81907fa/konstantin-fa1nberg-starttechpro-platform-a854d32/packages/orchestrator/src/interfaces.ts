/**
 * Интерфейсы внешних API для пакета orchestrator
 *
 * Позволяют:
 * - Заменить console.log-моки на реальные вызовы
 * - Переключаться между mock и production реализациями
 * - Тестировать бизнес-логику без реальных API
 */

// ============================================
// Domain Service (Reg.ru / Cloudflare)
// ============================================

export interface IDomainApi {
  registerDomain(domain: string, config: DomainApiConfig): Promise<DomainRegistrationApiResult>
  createDnsRecords(zoneId: string, records: DnsRecordApi[], config: DomainApiConfig): Promise<boolean>
  verifyCnameRecord(domain: string, expectedTarget: string): Promise<boolean>
  provisionSsl(domain: string): Promise<SslApiResult>
  deleteDomain(domain: string, config: DomainApiConfig): Promise<boolean>
}

export interface DomainApiConfig {
  provider: "regru" | "cloudflare"
  apiKey: string
  apiUrl?: string
}

export interface DomainRegistrationApiResult {
  success: boolean
  domain: string
  nameservers: string[]
  expiresAt: string
  error?: string
}

export interface DnsRecordApi {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS"
  name: string
  value: string
  ttl?: number
  priority?: number
}

export interface SslApiResult {
  success: boolean
  certificateUrl?: string
  expiresAt?: string
  error?: string
}

// ============================================
// Hosting Service (Vercel / Cloudflare Pages)
// ============================================

export interface IHostingApi {
  createProject(name: string, config: HostingProjectConfig, apiConfig: HostingApiConfig): Promise<HostingProjectApiResult>
  deploy(projectId: string, branchName: string, envVars: EnvVarApi[], apiConfig: HostingApiConfig): Promise<DeploymentApiResult>
  setEnvVars(projectId: string, envVars: EnvVarApi[], apiConfig: HostingApiConfig): Promise<boolean>
  assignDomain(projectId: string, domain: string, apiConfig: HostingApiConfig): Promise<boolean>
  getDeploymentStatus(deploymentId: string, apiConfig: HostingApiConfig): Promise<"building" | "ready" | "error">
  deleteProject(projectId: string, apiConfig: HostingApiConfig): Promise<boolean>
}

export interface HostingApiConfig {
  provider: "vercel" | "cloudflare-pages"
  token: string
  orgId?: string
  teamId?: string
}

export interface HostingProjectConfig {
  framework: "nextjs" | "static" | "node" | "other"
  rootDirectory: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
}

export interface HostingProjectApiResult {
  success: boolean
  projectId: string
  projectUrl: string
  previewUrl: string
  productionUrl: string
  error?: string
}

export interface DeploymentApiResult {
  success: boolean
  deploymentId: string
  deploymentUrl: string
  status: "building" | "ready" | "error"
  error?: string
}

export interface EnvVarApi {
  key: string
  value: string
  target: "production" | "preview" | "development"
  sensitive: boolean
}

// ============================================
// AI Provider (OpenAI / YandexGPT)
// ============================================

export interface IAIProvider {
  generateCode(prompt: string, context: string): Promise<AICodeResult>
  analyzeProject(code: string): Promise<AIAnalysisResult>
  chat(messages: AIChatMessage[]): Promise<AIChatResult>
}

export interface AIChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AICodeResult {
  success: boolean
  code: string
  explanation: string
  error?: string
}

export interface AIAnalysisResult {
  success: boolean
  suggestions: Array<{
    file: string
    line: number
    severity: "info" | "warning" | "critical"
    message: string
    suggestion: string
  }>
  error?: string
}

export interface AIChatResult {
  success: boolean
  content: string
  model: string
  tokensUsed: number
  error?: string
}

// ============================================
// Git Service (GitHub API)
// ============================================

export interface IGitApi {
  createBranch(repo: string, branchName: string, sourceBranch: string): Promise<boolean>
  deleteBranch(repo: string, branchName: string): Promise<boolean>
  createCommit(repo: string, branch: string, files: GitFileChange[], message: string): Promise<boolean>
  getFileContent(repo: string, path: string, ref?: string): Promise<string | null>
}

export interface GitFileChange {
  path: string
  content: string
  encoding: "utf-8" | "base64"
}

// ============================================
// Notification Service (Email / Telegram)
// ============================================

export interface INotificationApi {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>
  sendTelegram(chatId: string, message: string): Promise<boolean>
}

// ============================================
// Фабрика для получения реализации
// ============================================

export type Environment = "mock" | "production"

export function getCurrentEnvironment(): Environment {
  // В production используем реальные API, в development — моки
  if (process.env.NODE_ENV === "production" && process.env.USE_REAL_APIS === "true") {
    return "production"
  }
  return "mock"
}