import Link from "next/link"

const releasedProjects = [
  {
    id: "geopulse",
    title: "Геопульс",
    subtitle: "Global Educational Ecosystem v1.0",
    description: "Первый релиз глобальной образовательной экосистемы нового поколения. Операционная система для жизни человека в цифровую эпоху. Геопульс превращает карту Земли в живой учебник, где каждый объект связан со знаниями о природе, праве, экономике и культуре.",
    category: "EdTech / GovTech",
    status: "Релиз v1.0",
    gradient: "from-[#40E0D0] to-[#1E90FF]",
    link: "/projects/geopulse",
  },
  {
    id: "buildverse",
    title: "BUILDVERSE",
    subtitle: "Construction OS v1.0",
    description: "Первый релиз системы абсолютной консолидации строительной индустрии. Объединяет всё: от азов фундамента до новейшей архитектуры и культурного наследия. Цифровая операционная система для физического мира.",
    category: "PropTech / Industrial",
    status: "Релиз v1.0",
    gradient: "from-[#D4AF37] to-[#7E2FE0]",
    link: "/projects/buildverse",
  },
  {
    id: "prompt-studio",
    title: "Prompt Studio",
    subtitle: "AI Transaction Standard v1.0",
    description: "Первый релиз стандарта транзакции для рынка кастомных AI-решений глобально. Новая коммуникация ИИ и человека. Протокол, на котором бизнес заказывает интеллект, а разработчики его продают.",
    category: "AI Infrastructure / B2B",
    status: "Релиз v1.0",
    gradient: "from-[#BA55D3] to-[#3498db]",
    link: "/projects/prompt-studio",
  },
]

const devProjects = [
  {
    id: "synergymind",
    title: "SynergyMind",
    subtitle: "Нейро-платформа для коллективных решений",
    description: "SynergyMind — это симфония коллективного разума, где технологии делают команды непобедимыми. Альтернатива традиционным соцсетям с AI-фасилитацией и синтезом идей в реальном времени.",
    status: "Разработка",
    progress: 65,
    link: "/projects/synergymind",
  },
  {
    id: "connectsphere",
    title: "ConnectSphere",
    subtitle: "Сервис инклюзивных коммуникаций",
    description: "ConnectSphere сближает людей через доступные, барьер-free инструменты. Фокус на интеграции аудиторий, разных языков, способностей и культур.",
    status: "Разработка",
    progress: 75,
    link: "/projects/connectsphere",
  },
  {
    id: "groweasy",
    title: "GrowEasy",
    subtitle: "AI-ассистент для малого бизнеса",
    description: "GrowEasy возвышает малый бизнес до новых высот. AI-ассистент, который упрощает рост: от маркетинга и лидов до операций.",
    status: "Исследование",
    progress: 30,
    link: "/projects/groweasy",
  },
  {
    id: "learnsphere",
    title: "LearnSphere",
    subtitle: "Многоязычная образовательная платформа",
    description: "LearnSphere объединяет миллионы через образование. Многоязычная платформа с AI-переводом, персонализированными путями обучения и глобальным доступом.",
    status: "Концепция",
    progress: 15,
    link: "/projects/learnsphere",
  },
  {
    id: "greenpulse",
    title: "GreenPulse",
    subtitle: "Эко-сервис для устойчивого бизнеса",
    description: "GreenPulse защищает планету и бизнес. Помогает компаниям внедрять зелёные практики, отслеживать ESG-метрики, снижать углеродный след.",
    status: "Планирование",
    progress: 10,
    link: "/projects/greenpulse",
  },
]

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero-блок */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl font-manrope text-white">
            Цифровые продукты. Созданные интеллектом.
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-400 font-inter">
            Первая платформа-оркестратор, объединяющая полный цикл разработки — от архитектуры до деплоя — в единую экосистему AI-агентов.
          </p>

          <div className="flex animate-fade-in items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90 inline-flex items-center gap-2">
              Начать проект
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/ecosystem" className="bg-transparent border border-violet-500/30 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:bg-white/5">
              Исследовать экосистему
            </Link>
          </div>
        </div>
      </section>

      {/* Архитекторы Этичного Будущего — 4 блока ценностей */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl shimmer-text font-manrope">Архитекторы Этичного Будущего</h2>
            <p className="mx-auto max-w-4xl text-lg text-gray-400 font-inter">
              Как архитекторы этичного будущего, StartTechPro преобразует IT-индустрию, создавая продукты, которые соединяют передовые технологии, общественный потенциал и бизнес, воплощая этику и устремляя прогресс к благонамеренной созидательности.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="premium-card animate-fade-in">
              <div className="flex flex-col items-center text-center relative z-10">
                <h3 className="text-xl font-semibold text-white font-manrope mb-3">Этичный ИИ</h3>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">Мы разр��батываем искусственный интеллект, который не просто выполняет задачи, но делает это с учетом моральных и культурных нюансов. Наши нейросети проходят тщательный аудит на предвзятость, анализируя более 180 культурных контекстов, чтобы исключить дискриминацию и обеспечить справедливые решения.</p>
              </div>
            </div>
            <div className="premium-card animate-fade-in">
              <div className="flex flex-col items-center text-center relative z-10">
                <h3 className="text-xl font-semibold text-white font-manrope mb-3">Универсальный дизайн</h3>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">Наши продукты создаются для всех, независимо от возраста, способностей или контекста использования. Мы применяем принципы универсального дизайна и совместного проектирования (co-design), вовлекая пользователей с разными потребностями в процесс разработки.</p>
              </div>
            </div>
            <div className="premium-card animate-fade-in">
              <div className="flex flex-col items-center text-center relative z-10">
                <h3 className="text-xl font-semibold text-white font-manrope mb-3">Архитектура интеллекта</h3>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">В основе платформы — рой из пяти специализированных AI-агентов, работающих как единый конвейер. Аналитик формирует требования. Архитектор проектирует структуру. Разработчик генерирует код. Тестировщик гарантирует качество. Девопс разворачивает инфраструктуру.</p>
              </div>
            </div>
            <div className="premium-card animate-fade-in">
              <div className="flex flex-col items-center text-center relative z-10">
                <h3 className="text-xl font-semibold text-white font-manrope mb-3">Со-создание</h3>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">Мы верим в силу партнерства, где идеи рождаются в сотрудничестве. Наши проекты основаны на модели совместного владения интеллектуальной собственностью, что позволяет стартапам и корпорациям вместе создавать прорывные решения.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Выпущенные продукты (RELEASED) */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#40E0D0]" />
              Релиз v1.0
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl text-white font-manrope">
              Запущенные{" "}
              <span className="shimmer-text">продукты</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 font-inter">
              Три продукта. Три независимых направления. Один стандарт качества. Работающие системы, доступные здесь и сейчас.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {releasedProjects.map((project) => (
              <Link key={project.id} href={project.link} className="group">
                <div className="premium-card transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-violet-500/30 font-manrope font-medium text-[#40E0D0]">{project.status}</span>
                  </div>
                  <div className="mb-2 text-xs font-semibold text-[#40E0D0] tracking-wider uppercase font-manrope">{project.category}</div>
                  <h3 className="text-2xl font-bold text-white font-manrope mb-1">{project.title}</h3>
                  <p className="text-sm text-[#D4AF37] font-inter mb-4">{project.subtitle}</p>
                  <p className="text-sm text-gray-400 font-inter leading-relaxed flex-1">{project.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm text-[#D4AF37] group-hover:text-[#7E2FE0] transition-colors font-manrope">
                    <span>Подробнее</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Проекты в разработке */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#D4AF37]" />
              В разработке
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl text-white font-manrope">
              Проекты в{" "}
              <span className="shimmer-text">разработке</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 font-inter">
              Пять инновационных проектов на разных стадиях готовности — от концепции до активной разработки.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devProjects.map((project) => (
              <Link key={project.id} href={project.link} className="group">
                <div className="premium-card transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-violet-500/30 font-manrope font-medium text-[#D4AF37]">{project.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-manrope mb-1">{project.title}</h3>
                  <p className="text-xs text-[#D4AF37]/80 font-inter mb-3">{project.subtitle}</p>
                  <p className="text-sm text-gray-400 font-inter leading-relaxed flex-1 mb-4">{project.description}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="text-xs text-gray-400 font-inter">Прогресс:</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#7E2FE0] to-[#3498db]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#7E2FE0] font-manrope">{project.progress}%</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#D4AF37] group-hover:text-[#7E2FE0] transition-colors font-manrope">
                    <span>Подробнее</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Экосистема */}
      <section id="ecosystem" className="border-t border-[#7E2FE0]/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-violet-500/30 px-4 py-2 font-manrope font-medium text-white text-sm">
              Экосистема
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl text-white font-manrope">
              Как работает <span className="shimmer-text">фабрика</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400 font-inter">
              Пять AI-агентов работают в связке, проходя каждый этап создания продукта — от анализа до деплоя.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Интервью с агентом", desc: "AI-интервьюер задаёт вопросы, анализирует нишу и формирует ТЗ за 15 минут." },
              { step: "02", title: "Производство", desc: "Команда агентов (аналитик, архитектор, разработчик, QA) создаёт продукт." },
              { step: "03", title: "Запуск и сопровождение", desc: "Публикация на Vercel, мониторинг, еженедельные AI-отчёты и улучшения." },
            ].map((item) => (
              <div key={item.step} className="premium-card transition-all hover:bg-white/[0.06] animate-fade-in">
                <div className="mb-4 text-4xl font-bold shimmer-text font-manrope">{item.step}</div>
                <h3 className="mb-3 text-xl font-semibold text-white font-manrope">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400 font-inter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA-секция */}
      <section className="border-t border-[#7E2FE0]/30 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl text-white font-manrope">
            Будущее технологий с <span className="shimmer-text">StartTechPro</span>
          </h2>
          <p className="mb-10 text-lg text-gray-400 font-inter">
            Присоединяйтесь к нашей миссии: создавайте этичные и инновационные решения для бизнеса и общества. Вдохновляйтесь, пишите нам и творите прогресс.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/contacts" className="bg-gradient-to-r from-violet-600 to-cyan-600 inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90">
              Связаться с нами
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/partners" className="bg-gradient-to-r from-violet-600 to-cyan-600 inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium text-white font-manrope transition-all hover:opacity-90">
              Стать партнёром
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}