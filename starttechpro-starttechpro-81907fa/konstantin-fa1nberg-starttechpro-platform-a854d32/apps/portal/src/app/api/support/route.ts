import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { parsePaginationParams, createPaginationResult, getSqlRange } from "@/lib/pagination"

/**
 * API тикетов поддержки
 * POST /api/support — создание тикета
 * GET /api/support?page=1&pageSize=20 — список тикетов пользователя
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { subject, message, category } = body

    if (!subject || !message) {
      return NextResponse.json({ error: "Тема и сообщение обязательны" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject,
        message,
        category: category || "general",
        status: "open",
        priority: "medium",
      })
      .select()
      .single()

    if (error) {
      console.error("[Support API] Create error:", error)
      return NextResponse.json({ error: "Ошибка создания тикета" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: data.id,
        subject: data.subject,
        status: data.status,
        createdAt: data.created_at,
      },
    }, { status: 201 })
  } catch (error) {
    console.error("[Support API] Error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const url = new URL(request.url)
    const pagination = parsePaginationParams(url.searchParams)

    const { count: total } = await supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const range = getSqlRange(pagination)

    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(range.offset, range.offset + range.limit - 1)

    if (error) {
      return NextResponse.json({ error: "Ошибка загрузки тикетов" }, { status: 500 })
    }

    return NextResponse.json({
      tickets: (tickets || []).map((t) => ({
        id: t.id,
        subject: t.subject,
        message: t.message,
        status: t.status,
        priority: t.priority,
        category: t.category,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
      pagination: createPaginationResult(pagination, total || 0),
    })
  } catch (error) {
    console.error("[Support API] List error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}