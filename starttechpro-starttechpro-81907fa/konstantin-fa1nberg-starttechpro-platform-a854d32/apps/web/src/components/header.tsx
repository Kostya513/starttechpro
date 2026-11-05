"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/ecosystem", label: "Экосистема" },
  { href: "/products", label: "Продукты" },
  { href: "/pricing", label: "Тарифы" },
  { href: "/partners", label: "Партнёры" },
  { href: "/about", label: "О компании" },
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Логотип StartTechPro */}
        <Link href="/" className="flex flex-col items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#1A0A10] flex items-center justify-center">
                  <span className="text-xl font-bold shimmer-text">S</span>
                </div>
              </div>
            </div>
            <div className="font-bold text-xl mx-2">
              <span className="text-2xl font-bold shimmer-text">S</span>
              <span className="text-[#D4AF37]">tart</span>
              <span className="text-2xl font-bold shimmer-text">T</span>
              <span className="text-[#D4AF37]">ech</span>
              <span className="text-2xl font-bold shimmer-text">P</span>
              <span className="text-[#D4AF37]">ro</span>
            </div>
          </div>
          <div className="text-[10px] text-[#FAFAFA] tracking-widest uppercase font-light mt-0.5 opacity-70">
            DIGITAL TECHNOLOGY COMPANY
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-[#D4AF37] shimmer-text"
                  : "text-[#FAFAFA]/70 hover:text-[#FAFAFA]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm text-[#FAFAFA]/70 transition-colors hover:text-[#FAFAFA]"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="gradient-neon rounded-lg px-5 py-2 text-sm font-semibold text-white neon-border transition-all hover:opacity-90"
          >
            Запустить проект
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center md:hidden"
          aria-label="Меню"
        >
          <svg
            className="h-6 w-6 text-[#FAFAFA]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="glass-strong border-t border-[#7E2FE0]/30 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "text-[#D4AF37]"
                    : "text-[#FAFAFA]/70 hover:text-[#FAFAFA]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#7E2FE0]/30" />
            <Link
              href="/login"
              className="text-sm text-[#FAFAFA]/70 transition-colors hover:text-[#FAFAFA]"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="gradient-neon mt-2 inline-block rounded-lg px-5 py-2 text-center text-sm font-semibold text-white neon-border"
            >
              Запустить проект
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}