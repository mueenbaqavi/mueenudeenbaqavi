import { articles } from "@/data/content";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const items = articles
    .map((item) => `<item><title><![CDATA[${item.title}]]></title><link>${siteConfig.url}/articles/${item.slug}</link><description><![CDATA[${item.excerpt}]]></description><pubDate>${new Date(item.date).toUTCString()}</pubDate><guid>${siteConfig.url}/articles/${item.slug}</guid></item>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${siteConfig.description}</description>${items}</channel></rss>`, {
    headers: { "content-type": "application/rss+xml" },
  });
}
