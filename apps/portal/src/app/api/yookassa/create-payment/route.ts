import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { PLANS, type PlanId } from "@/lib/plans"

/**
 * Создание платежа через YooKassa
 * POST /api/yookassa/create-payment
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { planId, type } = await request.json() as { planId: PlanId; type: "subscription" | "topup" }

    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ error: "Неверный тариф" }, { status: 400 })
    }

    const plan = PLANS[planId]
    const amount = type === "topup" ? plan.price : plan.price

    const idempotenceKey = crypto.randomUUID()

    const paymentPayload = {
      amount: {
        value: (amount / 100).toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://starttechpro.ru"}/dashboard/billing?success=true`,
      },
      description: `Подписка ${plan.name} — ${(amount / 100).toFixed(2)} ₽`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        type: type || "subscription",
      },
      receipt: {
        customer: {
          email: user.email || "",
        },
        items: [
          {
            description: `Подписка ${plan.name}`,
            quantity: "1.00",
            amount: {
              value: (amount / 100).toFixed(2),
              currency: "RUB",
            },
            vat_code: 1, // 20% НДС
            payment_mode: "full_payment",
            payment_subject: "service",
          },
        ],
      },
    }

    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY

    if (!shopId || !secretKey) {
      return NextResponse.json({ error: "Платёжная система не настроена" }, { status: 500 })
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64")

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(paymentPayload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("YooKassa error:", errorData)
      return NextResponse.json({ error: "Ошибка платежа" }, { status: 500 })
    }

    const payment = await response.json()

    // Сохраняем платёж в БД
    await supabase.from("payments").insert({
      user_id: user.id,
      yookassa_id: payment.id,
      amount: amount,
      currency: "RUB",
      status: payment.status,
      plan_id: planId,
      description: paymentPayload.description,
    })

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      confirmation_url: payment.confirmation?.confirmation_url,
    })
  } catch (error) {
    console.error("Create payment error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}