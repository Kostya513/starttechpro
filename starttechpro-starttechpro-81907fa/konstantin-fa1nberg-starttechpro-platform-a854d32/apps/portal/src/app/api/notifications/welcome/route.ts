import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { sendEmail, emailTemplates } from "@/lib/email"
import { sendTelegram, telegramTemplates } from "@/lib/telegram"

/**
 * Отправка приветственного письма после регистрации
 * POST /api/notifications/welcome
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Пользователь"

    // Отправляем приветственное письмо
    const emailResult = await sendEmail({
      to: user.email!,
      ...emailTemplates.welcome(name),
    })

    // Отправляем уведомление в Telegram админам
    await sendTelegram(telegramTemplates.newUser(name, user.email!))

    return NextResponse.json({
      success: true,
      email: emailResult.success ? "sent" : "failed",
    })
  } catch (error) {
    console.error("Welcome notification error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 })
  }
}