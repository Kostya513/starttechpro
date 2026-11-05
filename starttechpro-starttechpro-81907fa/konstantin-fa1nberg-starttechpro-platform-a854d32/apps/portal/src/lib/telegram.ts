/**
 * Telegram-сервис для отправки уведомлений
 */

interface TelegramOptions {
  chatId?: string
  message: string
  parseMode?: "HTML" | "Markdown"
}

/**
 * Отправка сообщения в Telegram
 */
export async function sendTelegram({ chatId, message, parseMode = "HTML" }: TelegramOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const defaultChatId = process.env.TELEGRAM_CHAT_ID

    if (!token) {
      return { success: false, error: "TELEGRAM_BOT_TOKEN не настроен" }
    }

    const targetChatId = chatId || defaultChatId

    if (!targetChatId) {
      return { success: false, error: "Не указан chatId" }
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Telegram send error:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Telegram send error:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Шаблоны Telegram-уведомлений
 */
export const telegramTemplates = {
  newUser: (name: string, email: string) => ({
    message: `🎉 <b>Новый пользователь!</b>\n\nИмя: ${name}\nEmail: ${email}\n\n#регистрация`,
  }),

  newPayment: (name: string, amount: string, plan: string) => ({
    message: `💰 <b>Новый платёж!</b>\n\nПользователь: ${name}\nСумма: ${amount} ₽\nТариф: ${plan}\n\n#платёж`,
  }),

  projectUpdate: (projectName: string, status: string, userName: string) => ({
    message: `📋 <b>Обновление проекта</b>\n\nПроект: ${projectName}\nСтатус: ${status}\nПользователь: ${userName}\n\n#проект`,
  }),

  systemAlert: (message: string) => ({
    message: `🚨 <b>Системное оповещение</b>\n\n${message}\n\n#alert`,
  }),

  weeklyReport: (stats: { projects: number; agents: number; completed: number; revenue: string }) => ({
    message: `📊 <b>Еженедельный отчёт</b>\n\n📦 Проектов в работе: ${stats.projects}\n🤖 AI-агентов активно: ${stats.agents}\n✅ Завершено за неделю: ${stats.completed}\n💰 Выручка: ${stats.revenue} ₽\n\n#отчёт`,
  }),
}