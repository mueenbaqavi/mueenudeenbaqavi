import { notFound } from "next/navigation";
import { articles, books, courses, fatwas } from "@/data/content";

export function getArticleBySlug(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return article;
}

export function getFatwaBySlug(slug: string) {
  const fatwa = fatwas.find((item) => item.slug === slug);
  if (!fatwa) notFound();
  return fatwa;
}

export function getBookBySlug(slug: string) {
  const book = books.find((item) => item.slug === slug);
  if (!book) notFound();
  return book;
}

export function getCourseBySlug(slug: string) {
  const course = courses.find((item) => item.slug === slug);
  if (!course) notFound();
  return course;
}

export function getRelatedArticles(slug: string, category: string) {
  return articles.filter((item) => item.slug !== slug && item.category === category).slice(0, 3);
}

export function getRelatedFatwas(slug: string, category: string) {
  return fatwas.filter((item) => item.slug !== slug && item.category === category).slice(0, 3);
}
