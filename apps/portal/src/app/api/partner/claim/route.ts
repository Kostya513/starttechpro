import { NextResponse } from "next/server"

/**
 * API привязки реферального кода
 * POST /api/partner/claim
 *
 * Вызывается после регистрации пользователя, если в URL был ?ref=CODE
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, referralCode } = body

    if (!userId || !referralCode) {
      return NextResponse.json({ error: "Missing userId or referralCode" }, { status: 400 })
    }

    const { createClient } = require("@supabase/supabase-js")
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Ищем партнёра по реферальному коду
    const { data: referral, error: refError } = await serviceClient
      .from("partner_referrals")
      .select("partner_id, commission_rate")
      .eq("referral_code", referralCode)
      .eq("status", "active")
      .single()

    if (refError || !referral) {
      return NextResponse.json({ error: "Реферальный код не найден" }, { status: 404 })
    }

    // Проверяем, не привязан ли уже пользователь
    const { data: existing } = await serviceClient
      .from("partner_referrals")
      .select("id")
      .eq("referred_user_id", userId)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Пользователь уже привязан к партнёру" }, { status: 409 })
    }

    // Создаём привязку
    const { error: insertError } = await serviceClient
      .from("partner_referrals")
      .insert({
        partner_id: referral.partner_id,
        referred_user_id: userId,
        commission_rate: referral.commission_rate,
        referral_code: referralCode,
        lifetime_earnings: 0,
        status: "active",
      })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      partnerId: referral.partner_id,
    })
  } catch (error) {
    console.error("[Partner Claim API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}