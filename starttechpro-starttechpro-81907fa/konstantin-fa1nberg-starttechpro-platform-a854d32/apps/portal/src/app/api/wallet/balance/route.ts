import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Используем service client для доступа к финансовым таблицам
    const { createClient } = require("@supabase/supabase-js")
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: wallet, error } = await serviceClient
      .from("user_wallets")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      // Если кошелька нет — создаём
      if (error.code === "PGRST116") {
        const { data: newWallet, error: createError } = await serviceClient
          .from("user_wallets")
          .insert({ user_id: user.id, balance: 0, subscription_tier: "starter" })
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }

        return NextResponse.json({
          balance: newWallet.balance,
          subscriptionTier: newWallet.subscription_tier,
          nextBillingDate: newWallet.subscription_next_billing_date,
          isBlocked: newWallet.is_blocked,
          readOnlySince: newWallet.read_only_since,
        })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      balance: wallet.balance,
      subscriptionTier: wallet.subscription_tier,
      nextBillingDate: wallet.subscription_next_billing_date,
      isBlocked: wallet.is_blocked,
      readOnlySince: wallet.read_only_since,
    })
  } catch (error) {
    console.error("[Wallet API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}