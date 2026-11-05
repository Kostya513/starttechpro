import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/sidebar"

export const metadata: Metadata = {
  title: {
    default: "StartTechPro — Операционная зона",
    template: "%s | StartTechPro Internal",
  },
  description: "Внутренняя рабочая зона StartTechPro. Оркестратор агентов, админ-панель, управление производством.",
}

export default function InternalLayout({
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
        <div className="relative z-10 flex min-h-screen">
          <Sidebar>{children}</Sidebar>
        </div>
      </body>
    </html>
  )
}