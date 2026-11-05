/**
 * Email-сервис для отправки транзакционных писем через SMTP Яндекс
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Отправка email через SMTP
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.sendpulse.com/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SMTP_API_KEY}`,
      },
      body: JSON.stringify({
        email: {
          from: {
            name: "StartTechPro",
            email: process.env.EMAIL_FROM || "noreply@starttechpro.ru",
          },
          to: [{ email: to }],
          subject,
          html,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Шаблоны писем
 */
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Добро пожаловать в StartTechPro!",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A0A10; color: #FAFAFA; padding: 40px; border-radius: 16px; border: 2px solid #7E2FE0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">🚀</div>
          <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">StartTechPro</h1>
        </div>
        <h2 style="color: #FAFAFA; font-size: 20px;">Здравствуйте, ${name}!</h2>
        <p style="color: #A0A0B0; line-height: 1.6;">Добро пожаловать в экосистему StartTechPro! Мы рады, что вы с нами.</p>
        <p style="color: #A0A0B0; line-height: 1.6;">Теперь вам доступны:</p>
        <ul style="color: #A0A0B0; line-height: 1.8;">
          <li>Управление проектами в Личном кабинете</li>
          <li>AI-агенты для создания цифровых продуктов</li>
          <li>Библиотека промптов в Prompt Studio</li>
          <li>Круглосуточная поддержка</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://starttechpro.ru/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7E2FE0, #3498db); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; border: 2px solid #7E2FE0;">
            Перейти в дашборд
          </a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          StartTechPro — цифровая фабрика будущего<br>
          <a href="https://starttechpro.ru/privacy" style="color: #7E2FE0;">Политика конфиденциальности</a>
        </p>
      </div>
    `,
  }),

  paymentSuccess: (name: string, amount: string, planName: string) => ({
    subject: `Оплата подписки ${planName} — ${amount} ₽`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A0A10; color: #FAFAFA; padding: 40px; border-radius: 16px; border: 2px solid #7E2FE0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
          <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">StartTechPro</h1>
        </div>
        <h2 style="color: #FAFAFA; font-size: 20px;">Здравствуйте, ${name}!</h2>
        <p style="color: #A0A0B0; line-height: 1.6;">Платёж на сумму <strong style="color: #D4AF37;">${amount} ₽</strong> за подписку <strong style="color: #D4AF37;">${planName}</strong> успешно проведён.</p>
        <p style="color: #A0A0B0; line-height: 1.6;">Ваш тариф активен. Все функции разблокированы.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://starttechpro.ru/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7E2FE0, #3498db); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; border: 2px solid #7E2FE0;">
            Перейти в дашборд
          </a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          StartTechPro — цифровая фабрика будущего
        </p>
      </div>
    `,
  }),

  projectStatus: (name: string, projectName: string, status: string, message: string) => ({
    subject: `Проект «${projectName}» — ${status}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A0A10; color: #FAFAFA; padding: 40px; border-radius: 16px; border: 2px solid #7E2FE0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
          <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">StartTechPro</h1>
        </div>
        <h2 style="color: #FAFAFA; font-size: 20px;">Здравствуйте, ${name}!</h2>
        <p style="color: #A0A0B0; line-height: 1.6;">Статус вашего проекта <strong style="color: #D4AF37;">«${projectName}»</strong> изменился на <strong style="color: #D4AF37;">${status}</strong>.</p>
        <p style="color: #A0A0B0; line-height: 1.6;">${message}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://starttechpro.ru/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7E2FE0, #3498db); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; border: 2px solid #7E2FE0;">
            Открыть проект
          </a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          StartTechPro — цифровая фабрика будущего
        </p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: "Сброс пароля — StartTechPro",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A0A10; color: #FAFAFA; padding: 40px; border-radius: 16px; border: 2px solid #7E2FE0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
          <h1 style="color: #D4AF37; font-size: 24px; margin: 0;">StartTechPro</h1>
        </div>
        <h2 style="color: #FAFAFA; font-size: 20px;">Здравствуйте, ${name}!</h2>
        <p style="color: #A0A0B0; line-height: 1.6;">Вы запросили сброс пароля. Для создания нового пароля перейдите по ссылке:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7E2FE0, #3498db); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; border: 2px solid #7E2FE0;">
            Сбросить пароль
          </a>
        </div>
        <p style="color: #A0A0B0; line-height: 1.6;">Ссылка действительна в течение 1 часа.</p>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
        </p>
      </div>
    `,
  }),
}