import { siteConfig } from "@/lib/site";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${siteConfig.url}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain" },
  });
}
