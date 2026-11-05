import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "StartTechPro — Клиентский портал",
    template: "%s | StartTechPro",
  },
  description: "Клиентский портал StartTechPro. Управляйте своими проектами, оплачивайте тарифы, общайтесь с AI-оркестратором.",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#1A0A10] font-sans antialiased">
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at center, transparent 0%, #1A0A10 80%)",
            backgroundColor: "#1A0A10",
          }}
        />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}