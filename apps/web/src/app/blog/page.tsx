import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Блог StartTechPro: экспертные статьи о цифровых продуктах, AI-агентах, веб-разработке и автоматизации бизнеса.",
}

const posts = [
  {
    slug: "chto-takoe-cifrovaya-fabrika",
    title: "Что такое цифровая фабрика и как она меняет разработку",
    desc: "Разбираем концепцию цифровой фабрики, AI-агентов и почему традиционные студии уходят в прошлое.",
    date: "2025-01-15",
    readTime: "5 мин",
    tags: ["AI", "Экосистема"],
  },
  {
    slug: "kak-ai-agenty-sozdayut-sajty",
    title: "Как AI-агенты создают сайты: полный цикл производства",
    desc: "От интервью до деплоя — пошаговый разбор того, как 7 AI-агентов создают цифровой продукт.",
    date: "2025-01-10",
    readTime: "7 мин",
    tags: ["AI", "Разработка"],
  },
  {
    slug: "pochemu-startapu-nuzhna-cifrovaya-fabrika",
    title: "Почему стартапу нужна цифровая фабрика, а не студия",
    desc: "Скорость, стоимость и качество: сравниваем классическую разработку с производством на AI-агентах.",
    date: "2025-01-05",
    readTime: "4 мин",
    tags: ["Стартапы", "Бизнес"],
  },
]

export default function BlogPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-[#D4AF37]">
            📝 Блог
          </div>
          <h1 className="mb-6 text-5xl font-bold md:text-6xl text-[#FAFAFA]">
            Экспертные{" "}
            <span className="shimmer-text">статьи</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#FAFAFA]/70">
            О цифровых продуктах, AI-агентах, автоматизации и будущем веб-разработки.
          </p>
        </div>
      </section>

      {/* Статьи */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass rounded-xl p-8 neon-border transition-all hover:bg-white/[0.04] animate-fade-in"
              >
                <div className="mb-4 flex items-center gap-3 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full glass-dark px-3 py-1 text-xs text-[#D4AF37]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-[#FAFAFA]/70">{post.readTime}</span>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-[#FAFAFA]">{post.title}</h2>
                <p className="mb-4 text-sm leading-relaxed text-[#FAFAFA]/70">{post.desc}</p>
                <span className="text-xs text-[#FAFAFA]/50">
                  {new Date(post.date).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}