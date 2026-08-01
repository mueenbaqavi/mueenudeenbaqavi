import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listPublishedArticles, listPublishedBooks, listPublishedCourses, listPublishedFatwas } from "@/lib/content-repository";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, books, courses, fatwas] = await Promise.all([
    listPublishedArticles(),
    listPublishedBooks(),
    listPublishedCourses(),
    listPublishedFatwas(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteConfig.url}/biography`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/fatwas`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/books`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/classes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/courses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/ahlu-sunnah`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((item) => ({
    url: `${siteConfig.url}/articles/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ahluSunnahRoutes: MetadataRoute.Sitemap = articles
    .filter((item) => item.category === "അഹ്‌ലുസ്സുന്ന" || item.tags.includes("സുന്നത്ത്"))
    .map((item) => ({
      url: `${siteConfig.url}/ahlu-sunnah/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const fatwaRoutes: MetadataRoute.Sitemap = fatwas.map((item) => ({
    url: `${siteConfig.url}/fatwas/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const bookRoutes: MetadataRoute.Sitemap = books.map((item) => ({
    url: `${siteConfig.url}/books/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((item) => ({
    url: `${siteConfig.url}/courses/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...ahluSunnahRoutes,
    ...fatwaRoutes,
    ...bookRoutes,
    ...courseRoutes,
  ];
}
