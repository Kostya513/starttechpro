import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, description } = body

    if (!amount || amount < 10000) {
      return NextResponse.json({ error: "Минимальная сумма пополнения — 100 ₽" }, { status: 400 })
    }

    // Создаём платёж через YooKassa
    const yooKassaResponse = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": `topup_${user.id}_${Date.now()}`,
        "Authorization": `Basic ${Buffer.from(
          `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: {
          value: (amount / 100).toFixed(2),
          currency: "RUB",
        },
        confirmation: {
          type: "redirect",
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://starttechpro.ru"}/dashboard/billing`,
        },
        description: description || `Пополнение кошелька StartTechPro на ${(amount / 100).toFixed(2)} ₽`,
        capture: true,
        metadata: {
          user_id: user.id,
          type: "wallet_topup",
        },
        receipts: {
          customer: {
            email: user.email || "",
          },
          items: [
            {
              description: `Пополнение кошелька StartTechPro`,
              quantity: 1,
              amount: {
                value: (amount / 100).toFixed(2),
                currency: "RUB",
              },
              vat_code: 1, // 20% НДС
            },
          ],
        },
      }),
    })

    if (!yooKassaResponse.ok) {
      const error = await yooKassaResponse.text()
      console.error("[Topup API] YooKassa error:", error)
      return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 })
    }

    const payment = await yooKassaResponse.json()

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
      amount: amount,
    })
  } catch (error) {
    console.error("[Topup API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}