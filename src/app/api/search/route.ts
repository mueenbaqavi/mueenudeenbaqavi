import { articles, fatwas } from "@/data/content";

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.toLowerCase().trim() ?? "";
  const results = [
    ...articles.map((item) => ({ type: "article", title: item.title, excerpt: item.excerpt, url: `/articles/${item.slug}` })),
    ...fatwas.map((item) => ({ type: "fatwa", title: item.title, excerpt: item.question, url: `/fatwas/${item.slug}` })),
  ].filter((item) => !query || `${item.title} ${item.excerpt}`.toLowerCase().includes(query));

  return Response.json({ query, results });
}
