/**
 * Тесты для Provisioner
 *
 * Проверяют:
 * - generateBranchName: генерация имени ветки
 * - generateSubdomain: генерация поддомена
 * - generateEnvVars: генерация переменных окружения
 */

import { generateBranchName, generateSubdomain, generateEnvVars } from "./provisioner"
import type { ProvisionRequest } from "./provisioner"

describe("Provisioner", () => {
  const mockProvision: ProvisionRequest = {
    userId: "user_abc12345",
    projectId: "proj_12345_abc",
    projectName: "Мой проект",
    projectType: "website",
    planId: "starter",
  }

  describe("generateBranchName", () => {
    it("должен генерировать корректное имя ветки", () => {
      const branch = generateBranchName("user_abc12345", "Мой проект")
      expect(branch).toMatch(/^user-[a-z0-9]+-[a-z0-9-]+$/)
    })

    it("должен обрезать длинные имена", () => {
      const longName = "a".repeat(100)
      const branch = generateBranchName("user_abc12345", longName)
      expect(branch.length).toBeLessThanOrEqual(60)
    })

    it("должен заменять спецсимволы на дефисы", () => {
      const branch = generateBranchName("user_abc12345", "test!@#project")
      expect(branch).not.toContain("!")
      expect(branch).not.toContain("@")
      expect(branch).not.toContain("#")
    })
  })

  describe("generateSubdomain", () => {
    it("должен генерировать корректный поддомен", () => {
      const subdomain = generateSubdomain("Мой проект")
      expect(subdomain).toMatch(/^[a-z0-9-]+\.starttechpro\.ru$/)
    })

    it("должен заканчиваться на starttechpro.ru", () => {
      const subdomain = generateSubdomain("test")
      expect(subdomain).toContain(".starttechpro.ru")
    })
  })

  describe("generateEnvVars", () => {
    it("должен генерировать все необходимые переменные", () => {
      const envVars = generateEnvVars(mockProvision)
      expect(envVars.NEXT_PUBLIC_TENANT_ID).toBeDefined()
      expect(envVars.NEXT_PUBLIC_PROJECT_ID).toBe(mockProvision.projectId)
      expect(envVars.NEXT_PUBLIC_SITE_URL).toBeDefined()
      expect(envVars.NEXT_PUBLIC_DOMAIN).toBeDefined()
      expect(envVars.BRANCH_NAME).toBeDefined()
      expect(envVars.SUPABASE_TENANT_SCHEMA).toBeDefined()
    })

    it("должен устанавливать feature flags по тарифу", () => {
      const starter = generateEnvVars(mockProvision)
      expect(starter.NEXT_PUBLIC_ENABLE_PAYMENTS).toBe("false")
      expect(starter.NEXT_PUBLIC_ENABLE_ANALYTICS).toBe("false")

      const enterprise = generateEnvVars({ ...mockProvision, planId: "enterprise" })
      expect(enterprise.NEXT_PUBLIC_ENABLE_PAYMENTS).toBe("true")
      expect(enterprise.NEXT_PUBLIC_ENABLE_ANALYTICS).toBe("true")
    })
  })
})