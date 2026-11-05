import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://starttechpro.ru"

  const routes = [
    "",
    "/ecosystem",
    "/products",
    "/pricing",
    "/about",
    "/contacts",
    "/partners",
    "/blog",
    "/privacy",
    "/terms",
    "/consent",
    "/tariffs-and-conditions",
    "/projects/geopulse",
    "/projects/buildverse",
    "/projects/prompt-studio",
    "/projects/synergymind",
    "/projects/connectsphere",
    "/projects/groweasy",
    "/projects/learnsphere",
    "/projects/greenpulse",
    "/blog/chto-takoe-cifrovaya-fabrika",
    "/blog/kak-ai-agenty-sozdayut-sajty",
    "/blog/pochemu-startapu-nuzhna-cifrovaya-fabrika",
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route.startsWith("/blog/") ? "monthly" : "monthly",
    priority: route === "" ? 1.0 : route.startsWith("/projects/") ? 0.9 : route.startsWith("/blog/") ? 0.85 : 0.8,
  }))
}