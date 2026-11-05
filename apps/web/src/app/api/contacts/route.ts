import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

/**
 * API контактной формы
 * POST /api/contacts — отправка сообщения с сайта
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Имя, email и сообщение обязательны" }, { status: 400 })
    }

    // Базовая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { error } = await supabase
      .from("contact_requests")
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        source: "website",
        status: "new",
      })

    if (error) {
      console.error("[Contacts API] Error:", error)
      return NextResponse.json({ error: "Ошибка отправки сообщения" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Сообщение отправлено. Мы свяжемся с вами в ближайшее время.",
    }, { status: 201 })
  } catch (error) {
    console.error("[Contacts API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}