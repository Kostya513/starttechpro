import { createBrowserClient } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CookieOptions } from "@supabase/ssr"

/**
 * Клиентский Supabase-клиент для браузера.
 * Использовать в клиентских компонентах (use client).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Серверный Supabase-клиент для Server Components и Route Handlers.
 * Использовать в серверных компонентах и API-роутах.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}

/**
 * Сервисный (admin) клиент с service_role key.
 * Только для серверных операций (не передавать на клиент!).
 */
export function createServiceClient() {
  const { createClient } = require("@supabase/supabase-js")
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}