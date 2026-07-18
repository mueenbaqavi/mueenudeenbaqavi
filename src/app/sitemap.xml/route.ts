import { articles, books, courses, fatwas } from "@/data/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const staticRoutes = ["", "/biography", "/articles", "/fatwas", "/books", "/classes", "/courses", "/ahlu-sunnah", "/contact"];
  const dynamicRoutes = [
    ...articles.map((item) => `/articles/${item.slug}`),
    ...articles.filter((item) => item.category === "അഹ്‌ലുസ്സുന്ന" || item.tags.includes("സുന്നത്ത്")).map((item) => `/ahlu-sunnah/${item.slug}`),
    ...fatwas.map((item) => `/fatwas/${item.slug}`),
    ...books.map((item) => `/books/${item.slug}`),
    ...courses.map((item) => `/courses/${item.slug}`),
  ];
  const urls = [...staticRoutes, ...dynamicRoutes]
    .map((path) => `<url><loc>${siteConfig.url}${path}</loc><changefreq>weekly</changefreq><priority>${path === "" ? "1.0" : "0.7"}</priority></url>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "content-type": "application/xml" },
  });
}
