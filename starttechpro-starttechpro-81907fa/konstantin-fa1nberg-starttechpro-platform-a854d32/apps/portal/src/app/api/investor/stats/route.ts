import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API инвестора платформы
 * GET /api/investor/stats — статистика инвестора
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

    // Профиль инвестора платформы
    const { data: investor } = await serviceClient
      .from("platform_investors")
      .select("*")
      .eq("investor_id", user.id)
      .single()

    // Инвестиции в проекты
    const { data: investments } = await serviceClient
      .from("project_investments")
      .select("*, project_id")
      .eq("investor_id", user.id)
      .order("created_at", { ascending: false })

    // Кошелёк
    const { data: wallet } = await serviceClient
      .from("user_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      isPlatformInvestor: !!investor,
      platformInvestment: investor ? {
        investmentAmount: investor.investment_amount,
        revenueShareRate: investor.revenue_share_rate,
        multiplicationTarget: investor.multiplication_target,
        currentMultiplication: investor.current_multiplication,
        totalPaid: investor.total_paid,
        isActive: investor.is_active,
        joinedAt: investor.joined_at,
        lastPayoutAt: investor.last_payout_at,
      } : null,
      projectInvestments: (investments || []).map((inv: Record<string, unknown>) => ({
        id: inv.id,
        projectId: inv.project_id,
        amount: inv.amount,
        equityShare: inv.equity_share,
        status: inv.status,
        expectedRoi: inv.expected_roi,
        paidDividends: inv.paid_dividends,
        createdAt: inv.created_at,
      })),
      balance: wallet?.balance || 0,
    })
  } catch (error) {
    console.error("[Investor API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}