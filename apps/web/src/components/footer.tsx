import Link from "next/link"

const footerLinks = {
  платформа: [
    { href: "/ecosystem", label: "Экосистема" },
    { href: "/products", label: "Продукты" },
    { href: "/pricing", label: "Тарифы" },
  ],
  компания: [
    { href: "/about", label: "О компании" },
    { href: "/partners", label: "Партнёры" },
    { href: "/blog", label: "Блог" },
    { href: "/contacts", label: "Контакты" },
  ],
  юридическое: [
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Публичная оферта" },
    { href: "/consent", label: "Согласие на обработку ПДн" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[#7E2FE0]/30 glass-dark mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7E2FE0] to-[#3498db] animate-border-flow flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#1A0A10] flex items-center justify-center">
                      <span className="text-lg font-bold shimmer-text">S</span>
                    </div>
                  </div>
                </div>
                <div className="font-bold text-lg mx-2">
                  <span className="text-lg font-bold shimmer-text">S</span>
                  <span className="text-[#D4AF37]">tart</span>
                  <span className="text-lg font-bold shimmer-text">T</span>
                  <span className="text-[#D4AF37]">ech</span>
                  <span className="text-lg font-bold shimmer-text">P</span>
                  <span className="text-[#D4AF37]">ro</span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-[#FAFAFA]/70 leading-relaxed">
              Цифровая фабрика будущего. Создаём продукты с помощью AI-агентов.
            </p>
            <div className="flex gap-4 mt-2">
              {/* VK */}
              <a href="https://vk.com/club229825125" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 16.711h-1.962c-.77 0-.952-.613-2.261-1.922-1.138-1.103-1.683-1.228-1.962-1.228-.403 0-.522.114-.522.671v1.749c0 .488-.137.73-1.184.73-1.751 0-3.633-.95-4.99-2.95-2.028-3.114-2.582-5.49-2.582-5.981 0-.228.114-.432.67-.432h1.962c.502 0 .683.228.876.76.952 2.728 2.545 5.112 3.197 5.112.243 0 .354-.114.354-.73v-2.834c-.073-1.313-.765-1.427-.765-1.9 0-.228.19-.432.495-.432h3.075c.426 0 .559.228.559.73v3.816c0 .414.19.556.305.556.243 0 .452-.142.904-.594 1.4-1.556 2.414-3.954 2.414-3.954.137-.33.366-.625.88-.625h1.962c.59 0 .726.304.59.73-.243 1.141-2.607 4.439-2.607 4.439-.201.33-.268.476 0 .838.2.304.88.913 1.316 1.464.813 1.037 1.4 1.9 1.574 2.5.196.6-.073.903-.647.903z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a href="https://t.me/StartTechPro" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.175 1.933-.927 6.605-1.308 8.763-.16.906-.475 1.213-.779 1.243-.663.07-1.166-.441-1.809-.865-1.007-.659-1.576-1.067-2.552-1.712-1.124-.747-.395-1.158.245-1.828.166-.178 3.055-2.8 3.11-3.035.007-.033.013-.161-.062-.227-.074-.068-.173-.44-.248-.042-.103.021-1.777 1.13-5.021 3.315-.476.327-.907.486-1.294.478-.425-.008-1.246-.24-1.854-.438-.75-.243-1.345-.374-1.292-.789.027-.217.326-.435.896-.659 3.511-1.523 5.862-2.527 7.043-3.011 3.353-1.385 4.05-1.627 4.502-1.636.14-.002.27.016.384.06.318.126.41.402.376.643z"/>
                </svg>
              </a>
              {/* Дзен */}
              <a href="https://dzen.ru/id/67e5cb18e229701494c6515b" target="_blank" rel="noopener noreferrer" className="text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.34 24H1.86C.83 24 0 23.17 0 22.14V1.86C0 .83.83 0 1.86 0h19.28C22.17 0 23 .83 23 1.86v19.28c0 1.03-.83 1.86-1.86 1.86h-7.8zm-1.69-2.93c.65 0 1.18-.53 1.18-1.18v-8.93l-8.32 8.32h6.25c.47 0 .89.32 1.14.62l-.25 1.17zm-5.08-18.14c-.65 0-1.18.53-1.18 1.18v8.93l8.32-8.32H9.28c-.47 0-.89-.32-1.14-.62l.25-1.17h-1.82zm11.08 4.71l-8.32 8.32h6.57c.65 0 1.18-.53 1.18-1.18V8.92c0-.47.32-.89.62-1.14l-1.17-.25h1.12v.11zm-10.3 8.32l8.32-8.32h-6.57c-.65 0-1.18.53-1.18 1.18v6.01c0 .47-.32.89-.62 1.14l1.17.25h-1.12v-.26z"/>
                </svg>
              </a>
            </div>
            <div className="flex gap-3 mt-1">
              <a href="https://vc.ru/u/2955029-starttechpro" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">VC.RU</a>
              <a href="https://tenchat.ru/4458910" target="_blank" rel="noopener noreferrer" className="text-xs text-[#7E2FE0] hover:text-[#D4AF37] transition-colors">TenChat</a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#FAFAFA]">
                {title}
              </h4>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#FAFAFA]/70 transition-colors hover:text-[#D4AF37]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#7E2FE0]/30 pt-8 md:flex-row">
          <p className="text-sm text-[#FAFAFA]/70">
            © {new Date().getFullYear()} StartTechPro. Все права защищены.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-[#FAFAFA]/70">
              Сделано с любовью и AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}