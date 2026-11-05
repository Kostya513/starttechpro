import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SpaceParticles } from "@/components/space-particles"
import "./globals.css"

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "StartTechPro — Цифровая фабрика будущего",
    template: "%s | StartTechPro",
  },
  description:
    "Первая платформа-оркестратор, объединяющая полный цикл разработки — от архитектуры до деплоя — в единую экосистему AI-агентов.",
  keywords: [
    "StartTechPro",
    "цифровая фабрика",
    "AI-агенты",
    "разработка сайтов",
    "искусственный интеллект",
    "веб-разработка",
  ],
  openGraph: {
    title: "StartTechPro — Цифровая фабрика будущего",
    description:
      "Первая платформа-оркестратор, объединяющая полный цикл разработки в единую экосистему AI-агентов.",
    type: "website",
    locale: "ru_RU",
    siteName: "StartTechPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartTechPro — Цифровая фабрика будущего",
    description:
      "Первая платформа-оркестратор, объединяющая полный цикл разработки в единую экосистему AI-агентов.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {/* Космический фон — галактика с туманностями и звёздами */}
        <div className="fixed inset-0 z-0 pointer-events-none cosmic-bg" />
        {/* Canvas-анимация частиц */}
        <SpaceParticles />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}