import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const type = searchParams.get("type")

    const { createClient } = require("@supabase/supabase-js")
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    let query = serviceClient
      .from("wallet_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq("type", type)
    }

    const { data: transactions, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      transactions: transactions.map((t: Record<string, unknown>) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        balanceAfter: t.balance_after,
        description: t.description,
        metadata: t.metadata,
        createdAt: t.created_at,
      })),
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[Wallet Transactions API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}