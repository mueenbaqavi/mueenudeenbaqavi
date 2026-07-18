import { articles, books, courses, fatwas, type ContentItem } from "@/data/content";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";

type ContentEntryRow = {
  title: string;
  slug: string;
  excerpt: string | null;
  body_markdown: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
  views_count: number | null;
  categories: { name: string } | null;
  profiles: { full_name: string } | null;
};

type FatwaRow = {
  fatwa_number: string;
  question: string;
  answer: string;
  content_entries: ContentEntryRow | null;
};

function paragraphize(markdown: string | null) {
  return markdown?.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean) ?? [];
}

function mapContentRow(row: ContentEntryRow, image = "/images/article-emerald.svg"): ContentItem {
  return {
    id: row.slug,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    body: paragraphize(row.body_markdown),
    category: row.categories?.name ?? "General",
    date: row.published_at ?? new Date().toISOString(),
    readTime: `${row.read_time_minutes ?? 1} മിനിറ്റ്`,
    views: row.views_count ?? 0,
    author: row.profiles?.full_name ?? "മുഹീനുദ്ദീൻ ബാഖവി",
    image,
    tags: [],
  };
}

export async function listPublishedArticles() {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return articles;

  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles(full_name)")
    .eq("kind", "article")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return articles;
  return (data as unknown as ContentEntryRow[]).map((row) => mapContentRow(row));
}

export async function getPublishedArticleBySlug(slug: string) {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return articles.find((article) => article.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles(full_name)")
    .eq("kind", "article")
    .eq("status", "published")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return articles.find((article) => article.slug === slug) ?? null;
  return mapContentRow(data as unknown as ContentEntryRow);
}

export async function listPublishedAhluSunnahArticles() {
  const seeded = articles.filter((item) => item.category === "അഹ്‌ലുസ്സുന്ന" || item.tags.includes("സുന്നത്ത്"));
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return seeded;

  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles(full_name)")
    .eq("kind", "ahlu_sunnah")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return seeded;
  return (data as unknown as ContentEntryRow[]).map((row) => mapContentRow(row, "/images/article-gold.svg"));
}

export async function listPublishedFatwas() {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return fatwas;

  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles(full_name))")
    .eq("content_entries.kind", "fatwa")
    .eq("content_entries.status", "published")
    .is("content_entries.deleted_at", null)
    .order("published_at", { referencedTable: "content_entries", ascending: false });

  if (error || !data?.length) return fatwas;

  return (data as unknown as FatwaRow[]).flatMap((row) => {
    if (!row.content_entries) return [];
    return [{
      number: row.fatwa_number,
      title: row.content_entries.title,
      slug: row.content_entries.slug,
      question: row.question,
      answer: row.answer,
      category: row.content_entries.categories?.name ?? "General",
      tags: [],
      date: row.content_entries.published_at ?? new Date().toISOString(),
      views: row.content_entries.views_count ?? 0,
      readTime: `${row.content_entries.read_time_minutes ?? 1} മിനിറ്റ്`,
    }];
  });
}

export async function getPublishedFatwaBySlug(slug: string) {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return fatwas.find((fatwa) => fatwa.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles(full_name))")
    .eq("content_entries.kind", "fatwa")
    .eq("content_entries.status", "published")
    .eq("content_entries.slug", slug)
    .is("content_entries.deleted_at", null)
    .maybeSingle();

  if (error || !data) return fatwas.find((fatwa) => fatwa.slug === slug) ?? null;
  const row = data as unknown as FatwaRow;
  if (!row.content_entries) return null;

  return {
    number: row.fatwa_number,
    title: row.content_entries.title,
    slug: row.content_entries.slug,
    question: row.question,
    answer: row.answer,
    category: row.content_entries.categories?.name ?? "General",
    tags: [],
    date: row.content_entries.published_at ?? new Date().toISOString(),
    views: row.content_entries.views_count ?? 0,
    readTime: `${row.content_entries.read_time_minutes ?? 1} മിനിറ്റ്`,
  };
}

export async function listPublishedBooks() {
  return books;
}

export async function listPublishedCourses() {
  return courses;
}
