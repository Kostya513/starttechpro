import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API партнёрской программы
 * GET /api/partner/stats — статистика партнёра
 */

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { createClient } = require("@supabase/supabase-js")
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Получаем рефералы партнёра
    const { data: referrals, error: refError } = await serviceClient
      .from("partner_referrals")
      .select("*, referred_user_id")
      .eq("partner_id", user.id)
      .eq("status", "active")

    if (refError) {
      return NextResponse.json({ error: refError.message }, { status: 500 })
    }

    // Получаем кошелёк для отображения баланса
    const { data: wallet } = await serviceClient
      .from("user_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    // Генерируем реферальный код, если его нет
    let referralCode = ""
    if (!referrals || referrals.length === 0) {
      referralCode = `stp_${user.id.slice(0, 8)}_${Date.now().toString(36)}`
    } else {
      referralCode = referrals[0].referral_code
    }

    const totalEarnings = referrals?.reduce((sum, r) => sum + (r.lifetime_earnings || 0), 0) || 0
    const activeReferrals = referrals?.length || 0

    return NextResponse.json({
      referralCode,
      referralLink: `https://starttechpro.ru/register?ref=${referralCode}`,
      totalEarnings,
      activeReferrals,
      balance: wallet?.balance || 0,
      commissionRate: 20, // 20% пожизненно
      referrals: (referrals || []).map((r: Record<string, unknown>) => ({
        id: r.id,
        referredUserId: r.referred_user_id,
        commissionRate: r.commission_rate,
        lifetimeEarnings: r.lifetime_earnings,
        status: r.status,
        createdAt: r.created_at,
      })),
    })
  } catch (error) {
    console.error("[Partner API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}