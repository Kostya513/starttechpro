import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

/**
 * API White-Label лицензий
 * GET /api/white-label/stats — статус лицензии
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

    const { data: license } = await serviceClient
      .from("white_label_licenses")
      .select("*")
      .eq("licensee_id", user.id)
      .eq("is_active", true)
      .single()

    return NextResponse.json({
      hasLicense: !!license,
      license: license ? {
        id: license.id,
        brandName: license.brand_name,
        customDomain: license.custom_domain,
        licenseFee: license.license_fee,
        royaltyRate: license.royalty_rate,
        slaTier: license.sla_tier,
        dedicatedServers: license.dedicated_servers,
        auditSecurity: license.audit_security,
        isActive: license.is_active,
        activatedAt: license.activated_at,
        expiresAt: license.expires_at,
      } : null,
    })
  } catch (error) {
    console.error("[WhiteLabel API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}