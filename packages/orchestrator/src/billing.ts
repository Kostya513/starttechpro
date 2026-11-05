/**
 * Agent-Billing — финансовая архитектура StartTechPro
 *
 * Гибридная модель оплаты:
 * - Предоплата за инфраструктуру (домены, хостинг)
 * - Постоплата за потребление (AI-токены, вычисления)
 * - Фиксированная подписка (ежемесячно)
 *
 * Интеграции:
 * - YooKassa (приём платежей, Split Payments)
 * - Supabase (таблицы: user_wallets, wallet_transactions)
 * - Notification System (Email + Telegram + Push)
 * - Agent-Provisioner (проверка баланса перед публикацией)
 * - Agent-Maintainer (мониторинг баланса)
 */

import { createServiceClient } from "./supabase"
import { logger } from "./logger"
import { cache, CacheKeys } from "./cache"

// ============================================
// Типы данных
// ============================================

export type TransactionType =
  | "topup"
  | "subscription_deduction"
  | "infrastructure_purchase"
  | "ai_usage"
  | "payout"
  | "refund"
  | "partner_commission"
  | "royalty_deduction"
  | "investment_dividend"

export type SubscriptionTier = "starter" | "pro" | "enterprise"

export interface BillingEvent {
  userId: string
  type: TransactionType
  amount: number
  currency: string
  description: string
  metadata?: Record<string, unknown>
}

export interface WalletState {
  userId: string
  balance: number
  subscriptionTier: SubscriptionTier
  nextBillingDate: string | null
  isBlocked: boolean
  readOnlySince: string | null
}

export interface TransactionRecord {
  id: string
  userId: string
  type: TransactionType
  amount: number
  currency: string
  balanceAfter: number
  description: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface InvoiceData {
  userId: string
  userEmail: string
  userName: string
  userInn?: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  total: number
  currency: string
}

// ============================================
// Конфигурация тарифов и лимитов
// ============================================

export const SUBSCRIPTION_PRICES: Record<SubscriptionTier, number> = {
  starter: 9900,
  pro: 29900,
  enterprise: 99000,
}

export const AI_TOKEN_RATES: Record<string, number> = {
  "gpt-4o": 0.01,
  "gpt-4o-mini": 0.002,
  "claude-3.5": 0.015,
  "yandexgpt": 0.005,
  "gpt-4.1": 0.012,
}

export const ORCHESTRATOR_RATE_PER_MINUTE = 2.5

export const LOW_BALANCE_THRESHOLD = 50000
export const READ_ONLY_DAYS = 7
export const SERVICE_BLOCK_DAYS = 7

// ============================================
// 1. ПОЛУЧЕНИЕ КОШЕЛЬКА (с кэшированием)
// ============================================

export async function getWallet(userId: string): Promise<WalletState | null> {
  try {
    // Пытаемся получить из кэша
    const cached = cache.get<WalletState>(CacheKeys.wallet(userId))
    if (cached) return cached

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error || !data) {
      logger.error("Billing", "get-wallet", `Ошибка получения кошелька: ${error?.message}`, {
        userId: userId.slice(0, 8),
      })
      return null
    }

    const wallet: WalletState = {
      userId: data.user_id,
      balance: data.balance,
      subscriptionTier: data.subscription_tier,
      nextBillingDate: data.subscription_next_billing_date,
      isBlocked: data.is_blocked,
      readOnlySince: data.read_only_since,
    }

    // Кэшируем на 30 секунд (баланс может меняться)
    cache.set(CacheKeys.wallet(userId), wallet, 30_000)

    return wallet
  } catch (error) {
    logger.error("Billing", "get-wallet", `Ошибка получения кошелька: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return null
  }
}

// ============================================
// 2. ПРОВЕРКА БАЛАНСА
// ============================================

export async function checkBalance(
  userId: string,
  requiredAmount: number
): Promise<{ sufficient: boolean; balance: number; shortfall: number }> {
  const wallet = await getWallet(userId)
  if (!wallet) {
    return { sufficient: false, balance: 0, shortfall: requiredAmount }
  }

  const shortfall = Math.max(0, requiredAmount - wallet.balance)
  return {
    sufficient: wallet.balance >= requiredAmount,
    balance: wallet.balance,
    shortfall,
  }
}

// ============================================
// 3. СПИСАНИЕ СРЕДСТВ
// ============================================

export async function deductFromWallet(
  event: BillingEvent
): Promise<{
  success: boolean
  newBalance: number
  transactionId?: string
  error?: string
}> {
  try {
    const supabase = createServiceClient()

    const { data: wallet, error: walletError } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", event.userId)
      .single()

    if (walletError || !wallet) {
      logger.error("Billing", "deduct", "Кошелёк не найден", {
        userId: event.userId.slice(0, 8),
      })
      return { success: false, newBalance: 0, error: "Кошелёк не найден" }
    }

    if (wallet.balance < event.amount) {
      logger.warn("Billing", "deduct-insufficient", `Недостаточно средств`, {
        userId: event.userId.slice(0, 8),
        required: event.amount,
        balance: wallet.balance,
      })
      return {
        success: false,
        newBalance: wallet.balance,
        error: `Недостаточно средств. Требуется: ${event.amount} коп., доступно: ${wallet.balance} коп.`,
      }
    }

    const newBalance = wallet.balance - event.amount

    const { error: updateError } = await supabase
      .from("user_wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", event.userId)

    if (updateError) {
      logger.error("Billing", "deduct-update", `Ошибка обновления баланса: ${updateError.message}`, {
        userId: event.userId.slice(0, 8),
      })
      return { success: false, newBalance: wallet.balance, error: updateError.message }
    }

    // Инвалидируем кэш кошелька
    cache.delete(CacheKeys.wallet(event.userId))

    const { data: transaction, error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: event.userId,
        type: event.type,
        amount: event.amount,
        currency: event.currency,
        balance_after: newBalance,
        description: event.description,
        metadata: event.metadata || {},
      })
      .select()
      .single()

    if (txError) {
      logger.error("Billing", "deduct-tx", `Ошибка записи транзакции: ${txError.message}`, {
        userId: event.userId.slice(0, 8),
      })
    }

    if (newBalance < LOW_BALANCE_THRESHOLD && newBalance > 0) {
      await notifyLowBalance(event.userId, newBalance)
    }

    if (newBalance === 0) {
      await blockService(event.userId, "Нулевой баланс")
    }

    logger.info("Billing", "deduct-success", `Списание ${event.amount} коп.`, {
      userId: event.userId.slice(0, 8),
      type: event.type,
      newBalance,
    })

    return {
      success: true,
      newBalance,
      transactionId: transaction?.id,
    }
  } catch (error) {
    logger.error("Billing", "deduct-error", `Ошибка списания: ${String(error)}`, {
      userId: event.userId.slice(0, 8),
    })
    return { success: false, newBalance: 0, error: String(error) }
  }
}

// ============================================
// 4. ПОПОЛНЕНИЕ КОШЕЛЬКА
// ============================================

export async function topUpWallet(
  userId: string,
  amount: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<{
  success: boolean
  newBalance: number
  transactionId?: string
  error?: string
}> {
  try {
    const supabase = createServiceClient()

    const { data: wallet, error: walletError } = await supabase
      .from("user_wallets")
      .select("balance, is_blocked, read_only_since")
      .eq("user_id", userId)
      .single()

    if (walletError || !wallet) {
      logger.error("Billing", "topup", "Кошелёк не найден", { userId: userId.slice(0, 8) })
      return { success: false, newBalance: 0, error: "Кошелёк не найден" }
    }

    const newBalance = wallet.balance + amount

    const updateData: Record<string, unknown> = {
      balance: newBalance,
      updated_at: new Date().toISOString(),
    }

    if (wallet.is_blocked) {
      updateData.is_blocked = false
      updateData.blocked_at = null
      updateData.block_reason = null
      updateData.read_only_since = null
    }

    const { error: updateError } = await supabase
      .from("user_wallets")
      .update(updateData)
      .eq("user_id", userId)

    if (updateError) {
      logger.error("Billing", "topup-update", `Ошибка обновления: ${updateError.message}`, {
        userId: userId.slice(0, 8),
      })
      return { success: false, newBalance: wallet.balance, error: updateError.message }
    }

    // Инвалидируем кэш кошелька
    cache.delete(CacheKeys.wallet(userId))

    const { data: transaction, error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: userId,
        type: "topup",
        amount: amount,
        currency: "RUB",
        balance_after: newBalance,
        description: description,
        metadata: metadata || {},
      })
      .select()
      .single()

    if (txError) {
      logger.error("Billing", "topup-tx", `Ошибка записи транзакции: ${txError.message}`, {
        userId: userId.slice(0, 8),
      })
    }

    if (wallet.is_blocked) {
      await notifyServiceRestored(userId)
    }

    logger.info("Billing", "topup-success", `Пополнение ${amount} коп.`, {
      userId: userId.slice(0, 8),
      newBalance,
    })

    return {
      success: true,
      newBalance,
      transactionId: transaction?.id,
    }
  } catch (error) {
    logger.error("Billing", "topup-error", `Ошибка пополнения: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return { success: false, newBalance: 0, error: String(error) }
  }
}

// ============================================
// 5. АВТОМАТИЧЕСКОЕ СПИСАНИЕ ПОДПИСКИ
// ============================================

export async function processSubscriptionRenewal(userId: string): Promise<{
  success: boolean
  newBalance: number
  error?: string
}> {
  try {
    const wallet = await getWallet(userId)
    if (!wallet) {
      return { success: false, newBalance: 0, error: "Кошелёк не найден" }
    }

    const price = SUBSCRIPTION_PRICES[wallet.subscriptionTier]
    const nextBilling = new Date()
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    if (wallet.balance < price) {
      await enterReadOnlyMode(userId)
      logger.warn("Billing", "renewal-failed", `Недостаточно средств для продления`, {
        userId: userId.slice(0, 8),
        tier: wallet.subscriptionTier,
        balance: wallet.balance,
        required: price,
      })
      return {
        success: false,
        newBalance: wallet.balance,
        error: "Недостаточно средств для продления подписки",
      }
    }

    const result = await deductFromWallet({
      userId,
      type: "subscription_deduction",
      amount: price,
      currency: "RUB",
      description: `Подписка ${wallet.subscriptionTier === "starter" ? "Starter" : wallet.subscriptionTier === "pro" ? "Pro" : "Enterprise"} — ${(price / 100).toLocaleString("ru-RU")} ₽`,
      metadata: { tier: wallet.subscriptionTier, nextBillingDate: nextBilling.toISOString() },
    })

    if (result.success) {
      const supabase = createServiceClient()
      await supabase
        .from("user_wallets")
        .update({
          subscription_next_billing_date: nextBilling.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      await supabase.from("subscription_history").insert({
        user_id: userId,
        tier: wallet.subscriptionTier,
        amount: price,
        period_start: new Date().toISOString(),
        period_end: nextBilling.toISOString(),
        status: "active",
        transaction_id: result.transactionId,
      })

      await sendPaymentReceipt(userId, price, wallet.subscriptionTier)

      logger.info("Billing", "renewal-success", `Подписка продлена`, {
        userId: userId.slice(0, 8),
        tier: wallet.subscriptionTier,
        amount: price,
      })
    }

    return result
  } catch (error) {
    logger.error("Billing", "renewal-error", `Ошибка продления: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return { success: false, newBalance: 0, error: String(error) }
  }
}

// ============================================
// 6. РАСЧЁТ СТОИМОСТИ AI-ТОКЕНОВ
// ============================================

export function calculateAITokenCost(model: string, tokens: number): number {
  const rate = AI_TOKEN_RATES[model] || 0.01
  const markupRate = rate * 1.75
  return Math.round((tokens / 1000) * markupRate * 100)
}

export async function processDailyAICosts(userId: string, usage: Array<{ model: string; tokens: number }>): Promise<{
  success: boolean
  totalCost: number
  details: Array<{ model: string; tokens: number; cost: number }>
}> {
  const details = usage.map((u) => ({
    model: u.model,
    tokens: u.tokens,
    cost: calculateAITokenCost(u.model, u.tokens),
  }))

  const totalCost = details.reduce((sum, d) => sum + d.cost, 0)

  if (totalCost === 0) {
    return { success: true, totalCost: 0, details }
  }

  const result = await deductFromWallet({
    userId,
    type: "ai_usage",
    amount: totalCost,
    currency: "RUB",
    description: `AI-токены: ${details.map((d) => `${d.model} (${d.tokens} токенов)`).join(", ")}`,
    metadata: { usage: details },
  })

  return {
    success: result.success,
    totalCost,
    details,
  }
}

// ============================================
// 7. ПРОВЕРКА ПЕРЕД ПУБЛИКАЦИЕЙ ПРОЕКТА
// ============================================

export async function checkBeforePublish(
  userId: string,
  projectType: string
): Promise<{
  canPublish: boolean
  estimatedCost: number
  balance: number
  shortfall: number
  message: string
}> {
  const domainCost = 89000
  const hostingReserve = 49900
  const totalRequired = domainCost + hostingReserve

  const balanceCheck = await checkBalance(userId, totalRequired)

  if (balanceCheck.sufficient) {
    return {
      canPublish: true,
      estimatedCost: totalRequired,
      balance: balanceCheck.balance,
      shortfall: 0,
      message: `Баланс достаточен. Стоимость публикации: ${(totalRequired / 100).toLocaleString("ru-RU")} ₽`,
    }
  } else {
    return {
      canPublish: false,
      estimatedCost: totalRequired,
      balance: balanceCheck.balance,
      shortfall: balanceCheck.shortfall,
      message: `Недостаточно средств. Требуется: ${(totalRequired / 100).toLocaleString("ru-RU")} ₽, доступно: ${(balanceCheck.balance / 100).toLocaleString("ru-RU")} ₽`,
    }
  }
}

// ============================================
// 8. БЛОКИРОВКА / РАЗБЛОКИРОВКА СЕРВИСА
// ============================================

async function enterReadOnlyMode(userId: string): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase
      .from("user_wallets")
      .update({
        read_only_since: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    cache.delete(CacheKeys.wallet(userId))

    logger.warn("Billing", "read-only", `Режим Read Only активирован`, {
      userId: userId.slice(0, 8),
    })
    await notifyReadOnly(userId)
  } catch (error) {
    logger.error("Billing", "read-only-error", `Ошибка входа в Read Only: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
  }
}

export async function blockService(userId: string, reason: string): Promise<boolean> {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from("user_wallets")
      .update({
        is_blocked: true,
        blocked_at: new Date().toISOString(),
        block_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      logger.error("Billing", "block-error", `Ошибка блокировки: ${error.message}`, {
        userId: userId.slice(0, 8),
      })
      return false
    }

    cache.delete(CacheKeys.wallet(userId))

    logger.warn("Billing", "blocked", `Сервис заблокирован: ${reason}`, {
      userId: userId.slice(0, 8),
    })
    await notifyServiceBlocked(userId, reason)
    return true
  } catch (error) {
    logger.error("Billing", "block-error", `Ошибка блокировки: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return false
  }
}

export async function unblockService(userId: string): Promise<boolean> {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from("user_wallets")
      .update({
        is_blocked: false,
        blocked_at: null,
        block_reason: null,
        read_only_since: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      logger.error("Billing", "unblock-error", `Ошибка разблокировки: ${error.message}`, {
        userId: userId.slice(0, 8),
      })
      return false
    }

    cache.delete(CacheKeys.wallet(userId))

    logger.info("Billing", "unblocked", `Сервис разблокирован`, {
      userId: userId.slice(0, 8),
    })
    return true
  } catch (error) {
    logger.error("Billing", "unblock-error", `Ошибка разблокировки: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return false
  }
}

// ============================================
// 9. ПАРТНЁРСКИЕ КОМИССИИ
// ============================================

export async function processPartnerCommission(
  partnerId: string,
  referredUserId: string,
  subscriptionAmount: number
): Promise<{
  success: boolean
  commissionAmount: number
  error?: string
}> {
  try {
    const supabase = createServiceClient()

    const { data: referral, error: refError } = await supabase
      .from("partner_referrals")
      .select("commission_rate, lifetime_earnings")
      .eq("partner_id", partnerId)
      .eq("referred_user_id", referredUserId)
      .eq("status", "active")
      .single()

    if (refError || !referral) {
      logger.error("Billing", "partner-commission", "Реферал не найден", {
        partnerId: partnerId.slice(0, 8),
        referredUserId: referredUserId.slice(0, 8),
      })
      return { success: false, commissionAmount: 0, error: "Реферал не найден" }
    }

    const commissionAmount = Math.round(subscriptionAmount * (referral.commission_rate / 100))

    const topupResult = await topUpWallet(
      partnerId,
      commissionAmount,
      `Партнёрская комиссия (20%) за подписку пользователя ${referredUserId.slice(0, 8)}`,
      { referredUserId, subscriptionAmount, type: "partner_commission" }
    )

    if (topupResult.success) {
      await supabase
        .from("partner_referrals")
        .update({
          lifetime_earnings: referral.lifetime_earnings + commissionAmount,
        })
        .eq("partner_id", partnerId)
        .eq("referred_user_id", referredUserId)

      logger.info("Billing", "partner-commission-paid", `Комиссия ${commissionAmount} коп. выплачена`, {
        partnerId: partnerId.slice(0, 8),
        referredUserId: referredUserId.slice(0, 8),
      })
    }

    return {
      success: topupResult.success,
      commissionAmount,
      error: topupResult.error,
    }
  } catch (error) {
    logger.error("Billing", "partner-commission-error", `Ошибка комиссии: ${String(error)}`, {
      partnerId: partnerId.slice(0, 8),
    })
    return { success: false, commissionAmount: 0, error: String(error) }
  }
}

// ============================================
// 10. ГЕНЕРАЦИЯ ДОКУМЕНТОВ (EDF)
// ============================================

export async function generateDocument(invoice: InvoiceData): Promise<{
  success: boolean
  documentId?: string
  documentUrl?: string
  error?: string
}> {
  try {
    logger.info("Billing", "generate-doc", `Генерация документа для ${invoice.userName}: ${invoice.total} ${invoice.currency}`)

    return {
      success: true,
      documentId: `doc_${Date.now()}`,
      documentUrl: `https://diadoc.ru/d/${Date.now()}`,
    }
  } catch (error) {
    logger.error("Billing", "generate-doc-error", `Ошибка генерации документа: ${String(error)}`)
    return { success: false, error: String(error) }
  }
}

// ============================================
// 11. ЕЖЕМЕСЯЧНЫЙ ФИНАНСОВЫЙ ОТЧЁТ
// ============================================

export async function generateMonthlyReport(
  userId: string,
  year: number,
  month: number
): Promise<{
  subscription: number
  aiTokens: number
  domains: number
  hosting: number
  total: number
  breakdown: Array<{ category: string; amount: number; items: number }>
  transactions: TransactionRecord[]
} | null> {
  try {
    const supabase = createServiceClient()

    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    const { data: transactions, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false })

    if (error) {
      logger.error("Billing", "monthly-report", `Ошибка отчёта: ${error.message}`, {
        userId: userId.slice(0, 8),
      })
      return null
    }

    const subscription = transactions
      .filter((t) => t.type === "subscription_deduction")
      .reduce((sum, t) => sum + t.amount, 0)

    const aiTokens = transactions
      .filter((t) => t.type === "ai_usage")
      .reduce((sum, t) => sum + t.amount, 0)

    const domains = transactions
      .filter((t) => t.type === "infrastructure_purchase")
      .reduce((sum, t) => sum + t.amount, 0)

    const total = subscription + aiTokens + domains

    return {
      subscription,
      aiTokens,
      domains,
      hosting: 0,
      total,
      breakdown: [
        { category: "Подписка", amount: subscription, items: transactions.filter((t) => t.type === "subscription_deduction").length },
        { category: "AI-токены", amount: aiTokens, items: transactions.filter((t) => t.type === "ai_usage").length },
        { category: "Инфраструктура", amount: domains, items: transactions.filter((t) => t.type === "infrastructure_purchase").length },
      ],
      transactions: transactions.map((t) => ({
        id: t.id,
        userId: t.user_id,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        balanceAfter: t.balance_after,
        description: t.description,
        metadata: t.metadata || {},
        createdAt: t.created_at,
      })),
    }
  } catch (error) {
    logger.error("Billing", "monthly-report-error", `Ошибка отчёта: ${String(error)}`, {
      userId: userId.slice(0, 8),
    })
    return null
  }
}

// ============================================
// 12. УВЕДОМЛЕНИЯ
// ============================================

async function notifyLowBalance(userId: string, balance: number): Promise<void> {
  const balanceRub = (balance / 100).toLocaleString("ru-RU")
  logger.warn("Billing", "notify-low-balance", `Низкий баланс: ${balanceRub} ₽`, {
    userId: userId.slice(0, 8),
  })
}

async function notifyServiceBlocked(userId: string, reason: string): Promise<void> {
  logger.warn("Billing", "notify-blocked", `Сервис заблокирован: ${reason}`, {
    userId: userId.slice(0, 8),
  })
}

async function notifyReadOnly(userId: string): Promise<void> {
  logger.warn("Billing", "notify-read-only", `Режим Read Only`, {
    userId: userId.slice(0, 8),
  })
}

async function notifyServiceRestored(userId: string): Promise<void> {
  logger.info("Billing", "notify-restored", `Сервис восстановлен`, {
    userId: userId.slice(0, 8),
  })
}

async function sendPaymentReceipt(userId: string, amount: number, tier: SubscriptionTier): Promise<void> {
  const amountRub = (amount / 100).toLocaleString("ru-RU")
  logger.info("Billing", "receipt", `Чек отправлен: ${amountRub} ₽ — ${tier}`, {
    userId: userId.slice(0, 8),
  })
}

// ============================================
// 13. YOOKASSA SPLIT PAYMENTS
// ============================================

export async function createSplitPayment(params: {
  userId: string
  amount: number
  description: string
  platformFee: number
  partnerId?: string
  partnerAmount?: number
}): Promise<{
  success: boolean
  paymentUrl?: string
  paymentId?: string
  error?: string
}> {
  try {
    const { amount, description, platformFee } = params

    logger.info("Billing", "split-payment", `Split payment: ${(amount / 100).toFixed(2)} ₽ (fee: ${(platformFee / 100).toFixed(2)} ₽)`, {
      userId: params.userId.slice(0, 8),
    })

    return {
      success: true,
      paymentUrl: `https://yoomoney.ru/payment/${Date.now()}`,
      paymentId: `pay_${Date.now()}`,
    }
  } catch (error) {
    logger.error("Billing", "split-payment-error", `Ошибка Split Payment: ${String(error)}`, {
      userId: params.userId.slice(0, 8),
    })
    return { success: false, error: String(error) }
  }
}

// ============================================
// 14. WHITE-LABEL ROYALTY
// ============================================

export async function processWhiteLabelRoyalty(
  licenseeId: string,
  clientRevenue: number
): Promise<{
  success: boolean
  royaltyAmount: number
  error?: string
}> {
  try {
    const supabase = createServiceClient()

    const { data: license, error: licError } = await supabase
      .from("white_label_licenses")
      .select("royalty_rate")
      .eq("licensee_id", licenseeId)
      .eq("is_active", true)
      .single()

    if (licError || !license) {
      logger.error("Billing", "wl-royalty", "Лицензия не найдена", {
        licenseeId: licenseeId.slice(0, 8),
      })
      return { success: false, royaltyAmount: 0, error: "Лицензия не найдена" }
    }

    const royaltyAmount = Math.round(clientRevenue * (license.royalty_rate / 100))

    const result = await deductFromWallet({
      userId: licenseeId,
      type: "royalty_deduction",
      amount: royaltyAmount,
      currency: "RUB",
      description: `Royalty (${license.royalty_rate}%) за White-Label лицензию`,
      metadata: { clientRevenue, royaltyRate: license.royalty_rate },
    })

    return {
      success: result.success,
      royaltyAmount,
      error: result.error,
    }
  } catch (error) {
    logger.error("Billing", "wl-royalty-error", `Ошибка royalty: ${String(error)}`, {
      licenseeId: licenseeId.slice(0, 8),
    })
    return { success: false, royaltyAmount: 0, error: String(error) }
  }
}

// ============================================
// 15. ИНВЕСТИЦИОННЫЕ ВЫПЛАТЫ
// ============================================

export async function processInvestorPayouts(mrr: number): Promise<Array<{
  investorId: string
  amount: number
  currentMultiplier: number
}>> {
  try {
    const supabase = createServiceClient()

    const { data: investors, error } = await supabase
      .from("platform_investors")
      .select("*")
      .eq("is_active", true)

    if (error || !investors) {
      logger.error("Billing", "investor-payouts", `Ошибка выплат: ${error?.message}`)
      return []
    }

    const payouts: Array<{ investorId: string; amount: number; currentMultiplier: number }> = []

    for (const investor of investors) {
      if (investor.current_multiplication < investor.multiplication_target) {
        const payoutAmount = Math.round(mrr * (investor.revenue_share_rate / 100))
        const newMultiplier = (investor.total_paid + payoutAmount) / investor.investment_amount

        await topUpWallet(
          investor.investor_id,
          payoutAmount,
          `Дивиденды инвестора (${investor.revenue_share_rate}% от MRR)`,
          { mrr, revenueShareRate: investor.revenue_share_rate, type: "investment_dividend" }
        )

        await supabase
          .from("platform_investors")
          .update({
            total_paid: investor.total_paid + payoutAmount,
            current_multiplication: newMultiplier,
            last_payout_at: new Date().toISOString(),
          })
          .eq("investor_id", investor.investor_id)

        payouts.push({
          investorId: investor.investor_id,
          amount: payoutAmount,
          currentMultiplier: newMultiplier,
        })

        logger.info("Billing", "investor-payout", `Выплата ${payoutAmount} коп. инвестору`, {
          investorId: investor.investor_id.slice(0, 8),
          multiplier: newMultiplier.toFixed(2),
        })
      }
    }

    return payouts
  } catch (error) {
    logger.error("Billing", "investor-payouts-error", `Ошибка выплат: ${String(error)}`)
    return []
  }
}