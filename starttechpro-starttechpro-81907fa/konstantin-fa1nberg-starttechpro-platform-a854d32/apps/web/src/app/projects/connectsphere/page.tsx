import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ConnectSphere — Сервис инклюзивных коммуникаций",
  description: "ConnectSphere сближает людей через доступные, барьер-free инструменты. Платформа для инклюзивных коммуникаций с AI-переводом и поддержкой accessibility.",
}

export default function ConnectspherePage() {
  return (
    <div className="pt-24">
      <section className="px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#40E0D0]/10 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#3498db]/5 blur-[128px]" />
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#40E0D0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#40E0D0]" />
            Разработка • 75%
          </div>
          <div className="text-6xl mb-6">🌐</div>
          <h1 className="mb-4 text-5xl font-bold md:text-7xl text-[#FAFAFA]">
            <span className="shimmer-text">ConnectSphere</span>
          </h1>
          <p className="text-xl text-[#D4AF37] mb-6">Сервис инклюзивных коммуникаций</p>
          <p className="mx-auto max-w-3xl text-lg text-[#FAFAFA]/70 mb-8">
            ConnectSphere сближает людей через доступные, барьер-free инструменты (текст, голос, видео, AR/VR). Фокус на интеграции аудиторий — разные языки, способности, культуры.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90">Стать партнёром</Link>
            <Link href="/partners" className="glass rounded-lg px-6 py-3 text-sm font-medium text-[#FAFAFA] transition-all hover:bg-white/10">Инвестировать</Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-xl p-10 neon-border">
            <h2 className="text-3xl font-bold shimmer-text mb-6">Что такое ConnectSphere?</h2>
            <p className="text-[#1A0A10]/80 mb-4">Платформа, которая сближает людей через доступные, барьер-free инструменты.</p>
            <div className="space-y-4 text-sm text-[#1A0A10]/80">
              <p><strong>Проблема:</strong> Фрагментированные группы, языковые барьеры, отсутствие инклюзивности в коммуникациях.</p>
              <p><strong>Решение:</strong> Единая платформа с реал-тайм чатами, голосовыми комнатами, видео-конференциями с авто-переводом и субтитрами.</p>
              <p><strong>Ценность:</strong> Сближает фрагментированные группы, помогает бизнесу удерживать/расширять аудиторию. Монетизация — подписки, премиум-функции, партнёрские комиссии.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold shimmer-text mb-12 text-center">Ключевые функции</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Реал-тайм коммуникации</h3>
              <p className="text-sm text-[#1A0A10]/80">Чаты, голосовые комнаты, видео-конференции с авто-переводом и субтитрами в реальном времени.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">♿</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Инклюзивность</h3>
              <p className="text-sm text-[#1A0A10]/80">Поддержка для людей с инвалидностью (voice-to-text, жестовый язык), многоязычность, культурная адаптация.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🏘️</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Сообщества</h3>
              <p className="text-sm text-[#1A0A10]/80">Серверы (как Discord), профессиональный нетворкинг, события и мероприятия.</p>
            </div>
            <div className="glass rounded-xl p-6 neon-border">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-semibold text-[#D4AF37] mb-2">Партнёрские инструменты</h3>
              <p className="text-sm text-[#1A0A10]/80">White-label решения, API для интеграции в другие приложения, аналитика аудитории.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#7E2FE0]/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">Хотите стать частью проекта?</h2>
          <p className="text-[#FAFAFA]/70 mb-8">ConnectSphere — самый продвинутый проект. Можно уже тестировать MVP.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="gradient-neon rounded-lg px-8 py-4 text-base font-bold text-white neon-border transition-all hover:opacity-90">Стать партнёром</Link>
            <Link href="/partners" className="glass rounded-lg px-8 py-4 text-base font-medium text-[#FAFAFA] transition-all hover:bg-white/10">Инвестировать в проект</Link>
          </div>
        </div>
      </section>
    </div>
  )
}