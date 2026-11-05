/**
 * Mock-реализации внешних API для разработки и тестирования
 *
 * Все функции возвращают предсказуемые результаты без реальных вызовов.
 * Для переключения на production: установить NODE_ENV=production и USE_REAL_APIS=true
 */

import { logger } from "./logger"
import type {
  IDomainApi, DomainApiConfig, DomainRegistrationApiResult, DnsRecordApi, SslApiResult,
  IHostingApi, HostingApiConfig, HostingProjectConfig, HostingProjectApiResult, DeploymentApiResult, EnvVarApi,
  IAIProvider, AICodeResult, AIAnalysisResult, AIChatResult, AIChatMessage,
  IGitApi, GitFileChange,
  INotificationApi,
} from "./interfaces"

// ============================================
// Mock Domain API
// ============================================

export class MockDomainApi implements IDomainApi {
  async registerDomain(domain: string, _config: DomainApiConfig): Promise<DomainRegistrationApiResult> {
    logger.info("Domain", "register", `Mock регистрация домена: ${domain}`)
    return {
      success: true,
      domain,
      nameservers: ["ns1.starttechpro.ru", "ns2.starttechpro.ru"],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  async createDnsRecords(_zoneId: string, records: DnsRecordApi[], _config: DomainApiConfig): Promise<boolean> {
    logger.info("Domain", "dns", `Mock создание ${records.length} DNS-записей`)
    return true
  }

  async verifyCnameRecord(domain: string, expectedTarget: string): Promise<boolean> {
    logger.info("Domain", "verify-cname", `Mock проверка CNAME: ${domain} → ${expectedTarget}`)
    return true
  }

  async provisionSsl(domain: string): Promise<SslApiResult> {
    logger.info("Domain", "ssl", `Mock заказ SSL для: ${domain}`)
    return {
      success: true,
      certificateUrl: `https://${domain}`,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  async deleteDomain(domain: string, _config: DomainApiConfig): Promise<boolean> {
    logger.info("Domain", "delete", `Mock удаление домена: ${domain}`)
    return true
  }
}

// ============================================
// Mock Hosting API
// ============================================

export class MockHostingApi implements IHostingApi {
  async createProject(name: string, _config: HostingProjectConfig, _apiConfig: HostingApiConfig): Promise<HostingProjectApiResult> {
    logger.info("Hosting", "create", `Mock создание хостинг-проекта: ${name}`)
    return {
      success: true,
      projectId: `mock_${Date.now()}`,
      projectUrl: `https://${name}.vercel.app`,
      previewUrl: `https://${name}-preview.vercel.app`,
      productionUrl: `https://${name}.vercel.app`,
    }
  }

  async deploy(_projectId: string, branchName: string, _envVars: EnvVarApi[], _apiConfig: HostingApiConfig): Promise<DeploymentApiResult> {
    logger.info("Hosting", "deploy", `Mock деплой ветки: ${branchName}`)
    return {
      success: true,
      deploymentId: `deploy_mock_${Date.now()}`,
      deploymentUrl: `https://${_projectId}.vercel.app`,
      status: "ready",
    }
  }

  async setEnvVars(_projectId: string, envVars: EnvVarApi[], _apiConfig: HostingApiConfig): Promise<boolean> {
    logger.info("Hosting", "env", `Mock установка ${envVars.length} переменных окружения`)
    return true
  }

  async assignDomain(_projectId: string, domain: string, _apiConfig: HostingApiConfig): Promise<boolean> {
    logger.info("Hosting", "domain", `Mock привязка домена: ${domain}`)
    return true
  }

  async getDeploymentStatus(_deploymentId: string, _apiConfig: HostingApiConfig): Promise<"building" | "ready" | "error"> {
    return "ready"
  }

  async deleteProject(_projectId: string, _apiConfig: HostingApiConfig): Promise<boolean> {
    logger.info("Hosting", "delete", `Mock удаление проекта: ${_projectId}`)
    return true
  }
}

// ============================================
// Mock AI Provider
// ============================================

export class MockAIProvider implements IAIProvider {
  async generateCode(prompt: string, _context: string): Promise<AICodeResult> {
    logger.info("AI", "generate", `Mock генерация кода: "${prompt.slice(0, 50)}..."`)
    return {
      success: true,
      code: `// Mock generated code for: ${prompt}\nconsole.log("Hello from mock AI");\n`,
      explanation: "Это mock-ответ. В production здесь будет код от OpenAI/YandexGPT.",
    }
  }

  async analyzeProject(_code: string): Promise<AIAnalysisResult> {
    logger.info("AI", "analyze", "Mock анализ проекта")
    return {
      success: true,
      suggestions: [
        { file: "src/index.ts", line: 1, severity: "info", message: "Mock-анализ", suggestion: "Добавить обработку ошибок" },
      ],
    }
  }

  async chat(messages: AIChatMessage[]): Promise<AIChatResult> {
    const lastMessage = messages[messages.length - 1]?.content || ""
    logger.info("AI", "chat", `Mock чат: "${lastMessage.slice(0, 50)}..."`)
    return {
      success: true,
      content: `Это mock-ответ на: "${lastMessage.slice(0, 100)}"`,
      model: "mock-model",
      tokensUsed: 0,
    }
  }
}

// ============================================
// Mock Git API
// ============================================

export class MockGitApi implements IGitApi {
  async createBranch(_repo: string, branchName: string, _sourceBranch: string): Promise<boolean> {
    logger.info("Git", "create-branch", `Mock создание ветки: ${branchName}`)
    return true
  }

  async deleteBranch(_repo: string, branchName: string): Promise<boolean> {
    logger.info("Git", "delete-branch", `Mock удаление ветки: ${branchName}`)
    return true
  }

  async createCommit(_repo: string, _branch: string, files: GitFileChange[], message: string): Promise<boolean> {
    logger.info("Git", "commit", `Mock коммит: "${message}" (${files.length} файлов)`)
    return true
  }

  async getFileContent(_repo: string, path: string, _ref?: string): Promise<string | null> {
    logger.info("Git", "get-file", `Mock чтение файла: ${path}`)
    return `// Mock content for ${path}`
  }
}

// ============================================
// Mock Notification API
// ============================================

export class MockNotificationApi implements INotificationApi {
  async sendEmail(to: string, subject: string, _body: string): Promise<boolean> {
    logger.info("Notification", "email", `Mock отправка email: ${to} — "${subject}"`)
    return true
  }

  async sendTelegram(chatId: string, message: string): Promise<boolean> {
    logger.info("Notification", "telegram", `Mock отправка Telegram: ${chatId} — "${message.slice(0, 50)}..."`)
    return true
  }
}

// ============================================
// Фабрика для получения mock-реализаций
// ============================================

export function createMockDomainApi(): IDomainApi {
  return new MockDomainApi()
}

export function createMockHostingApi(): IHostingApi {
  return new MockHostingApi()
}

export function createMockAIProvider(): IAIProvider {
  return new MockAIProvider()
}

export function createMockGitApi(): IGitApi {
  return new MockGitApi()
}

export function createMockNotificationApi(): INotificationApi {
  return new MockNotificationApi()
}