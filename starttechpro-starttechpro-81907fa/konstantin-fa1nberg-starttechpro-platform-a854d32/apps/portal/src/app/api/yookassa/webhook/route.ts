import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

/**
 * Webhook для уведомлений от YooKassa
 * POST /api/yookassa/webhook
 *
 * Обрабатывает:
 * - Оплату подписки (subscription)
 * - Пополнение кошелька (wallet_topup)
 * - Split Payments (комиссия платформы)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, object } = body

    // Проверка подписи (в production — validate IP и HMAC)
    if (!event || !object) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const metadata = object.metadata || {}
    const paymentType = metadata.type // "subscription" | "wallet_topup"

    // Подтверждаем платёж (если требуется)
    if (event === "payment.waiting_for_capture") {
      // Автоматически подтверждаем
      const auth = Buffer.from(
        `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
      ).toString("base64")

      await fetch(`https://api.yookassa.ru/v3/payments/${object.id}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotence-Key": `capture_${object.id}`,
          "Authorization": `Basic ${auth}`,
        },
      })
    }

    if (event === "payment.succeeded") {
      const userId = metadata.user_id
      const amount = object.amount ? Math.round(parseFloat(object.amount.value) * 100) : 0

      if (!userId || amount <= 0) {
        return NextResponse.json({ error: "Invalid metadata" }, { status: 400 })
      }

      if (paymentType === "wallet_topup") {
        // === ПОПОЛНЕНИЕ КОШЕЛЬКА ===
        const { data: wallet } = await supabase
          .from("user_wallets")
          .select("balance, is_blocked")
          .eq("user_id", userId)
          .single()

        const newBalance = (wallet?.balance || 0) + amount

        // Обновляем баланс
        const updateData: Record<string, unknown> = {
          balance: newBalance,
          updated_at: new Date().toISOString(),
        }

        // Если был заблокирован — разблокируем
        if (wallet?.is_blocked) {
          updateData.is_blocked = false
          updateData.blocked_at = null
          updateData.block_reason = null
          updateData.read_only_since = null
        }

        await supabase.from("user_wallets").update(updateData).eq("user_id", userId)

        // Создаём транзакцию
        await supabase.from("wallet_transactions").insert({
          user_id: userId,
          type: "topup",
          amount: amount,
          currency: "RUB",
          balance_after: newBalance,
          description: `Пополнение кошелька на ${(amount / 100).toLocaleString("ru-RU")} ₽`,
          metadata: {
            payment_id: object.id,
            payment_method: object.payment_method?.type || "card",
          },
        })

        console.log(`[Webhook] Wallet topup: ${userId} +${amount} коп. (${(amount / 100).toFixed(2)} ₽)`)

      } else if (paymentType === "subscription") {
        // === ОПЛАТА ПОДПИСКИ ===
        const planId = metadata.plan_id

        // Проверяем, есть ли уже подписка
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .single()

        const now = new Date()
        const expiresAt = new Date(now)
        expiresAt.setMonth(expiresAt.getMonth() + 1)

        if (existing) {
          await supabase
            .from("subscriptions")
            .update({
              plan_id: planId,
              status: "active",
              current_period_start: now.toISOString(),
              current_period_end: expiresAt.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq("user_id", userId)
        } else {
          await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              plan_id: planId,
              status: "active",
              current_period_start: now.toISOString(),
              current_period_end: expiresAt.toISOString(),
            })
        }

        // Обновляем тариф в кошельке
        await supabase
          .from("user_wallets")
          .update({
            subscription_tier: planId,
            subscription_next_billing_date: expiresAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("user_id", userId)

        // Создаём транзакцию
        await supabase.from("wallet_transactions").insert({
          user_id: userId,
          type: "subscription_deduction",
          amount: amount,
          currency: "RUB",
          balance_after: 0,
          description: `Оплата подписки ${planId} — ${(amount / 100).toLocaleString("ru-RU")} ₽`,
          metadata: {
            payment_id: object.id,
            plan_id: planId,
          },
        })

        console.log(`[Webhook] Subscription activated: ${userId} — ${planId}`)
      }

      // Отправляем уведомление об успешном платеже
      // В production: email + telegram
    }

    if (event === "payment.canceled") {
      console.log(`[Webhook] Payment canceled: ${object.id}`)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}