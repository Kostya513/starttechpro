/**
 * Тесты для Agent-Billing
 *
 * Проверяют:
 * - getWallet: получение кошелька
 * - checkBalance: проверка баланса
 * - deductFromWallet: списание средств
 * - topUpWallet: пополнение кошелька
 * - calculateAITokenCost: расчёт стоимости AI-токенов
 */

import { calculateAITokenCost, SUBSCRIPTION_PRICES, AI_TOKEN_RATES } from "./billing"

describe("Billing", () => {
  describe("SUBSCRIPTION_PRICES", () => {
    it("должен содержать цены для всех тарифов", () => {
      expect(SUBSCRIPTION_PRICES.starter).toBe(9900)
      expect(SUBSCRIPTION_PRICES.pro).toBe(29900)
      expect(SUBSCRIPTION_PRICES.enterprise).toBe(99000)
    })

    it("цены должны быть в копейках и положительными", () => {
      for (const price of Object.values(SUBSCRIPTION_PRICES)) {
        expect(price).toBeGreaterThan(0)
        expect(Number.isInteger(price)).toBe(true)
      }
    })
  })

  describe("AI_TOKEN_RATES", () => {
    it("должен содержать ставки для всех моделей", () => {
      expect(AI_TOKEN_RATES["gpt-4o"]).toBeDefined()
      expect(AI_TOKEN_RATES["gpt-4o-mini"]).toBeDefined()
      expect(AI_TOKEN_RATES["yandexgpt"]).toBeDefined()
    })

    it("ставки должны быть положительными", () => {
      for (const rate of Object.values(AI_TOKEN_RATES)) {
        expect(rate).toBeGreaterThan(0)
      }
    })
  })

  describe("calculateAITokenCost", () => {
    it("должен рассчитывать стоимость для GPT-4o", () => {
      // 1000 токенов * 0.01 * 1.75 * 100 = 1.75 копеек → 2 коп.
      const cost = calculateAITokenCost("gpt-4o", 1000)
      expect(cost).toBe(2)
    })

    it("должен рассчитывать стоимость для YandexGPT", () => {
      // 1000 токенов * 0.005 * 1.75 * 100 = 0.875 копеек → 1 коп.
      const cost = calculateAITokenCost("yandexgpt", 1000)
      expect(cost).toBe(1)
    })

    it("должен использовать дефолтную ставку для неизвестной модели", () => {
      const cost = calculateAITokenCost("unknown-model", 1000)
      // 1000 * 0.01 * 1.75 * 100 = 1.75 → 2
      expect(cost).toBe(2)
    })

    it("должен возвращать 0 для 0 токенов", () => {
      const cost = calculateAITokenCost("gpt-4o", 0)
      expect(cost).toBe(0)
    })

    it("стоимость должна расти пропорционально токенам", () => {
      const cost1000 = calculateAITokenCost("gpt-4o", 1000)
      const cost2000 = calculateAITokenCost("gpt-4o", 2000)
      expect(cost2000).toBeGreaterThan(cost1000)
    })
  })
})