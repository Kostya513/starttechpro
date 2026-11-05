"use client"

import { useState } from "react"

export default function InternalSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#FAFAFA] mb-6">Настройки системы</h1>

      <div className="space-y-6 max-w-2xl">
        {/* LLM провайдеры */}
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">LLM-провайдеры</h2>
          <div className="space-y-4">
            {[
              { name: "OpenAI (GPT-4o)", key: "••••••••••sk-...", status: "Подключён" },
              { name: "Anthropic (Claude 3.5)", key: "••••••••••sk-ant-...", status: "Подключён" },
              { name: "YandexGPT", key: "••••••••••", status: "Подключён" },
            ].map((provider) => (
              <div key={provider.name} className="flex items-center justify-between glass rounded-lg p-3">
                <div>
                  <div className="text-sm text-[#FAFAFA]">{provider.name}</div>
                  <div className="text-xs text-[#FAFAFA]/40">{provider.key}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#40E0D0]/20 text-[#40E0D0]">{provider.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Платёжная система */}
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Платёжная система</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-sm text-[#FAFAFA]">YooKassa Shop ID</span>
              <span className="text-xs text-[#FAFAFA]/40">••••••••</span>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-sm text-[#FAFAFA]">Комиссия платформы</span>
              <span className="text-xs text-[#D4AF37]">15%</span>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3">
              <span className="text-sm text-[#FAFAFA]">Минимальная сумма вывода</span>
              <span className="text-xs text-[#FAFAFA]/40">1 000 ₽</span>
            </div>
          </div>
        </div>

        {/* Мониторинг */}
        <div className="glass rounded-xl p-6 neon-border">
          <h2 className="text-lg font-semibold text-[#FAFAFA] mb-4">Мониторинг</h2>
          <div className="space-y-3">
            {[
              { name: "Sentry (ошибки)", status: "Активен" },
              { name: "Axiom (логи)", status: "Активен" },
              { name: "Uptime Robot (доступность)", status: "Активен" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between glass rounded-lg p-3">
                <span className="text-sm text-[#FAFAFA]">{item.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#40E0D0]/20 text-[#40E0D0]">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Сохранение */}
        {saved && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            Настройки сохранены
          </div>
        )}

        <button
          onClick={handleSave}
          className="gradient-neon rounded-lg px-6 py-3 text-sm font-bold text-white neon-border transition-all hover:opacity-90"
        >
          Сохранить настройки
        </button>
      </div>
    </div>
  )
}