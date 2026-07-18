import { articles, fatwas } from "@/data/content";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/server";

export type AdminContentStatus = "draft" | "scheduled" | "published" | "archived";

export type AdminContentRow = {
  id: string;
  kind: "article" | "fatwa";
  title: string;
  slug: string;
  status: AdminContentStatus;
  category: string;
  publishedAt: string | null;
  updatedAt: string;
  views: number;
  seoScore: number | null;
  fatwaNumber?: string;
};

export type AdminArticleEditorValue = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  category: string;
  tags: string;
  status: AdminContentStatus;
  scheduledAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type AdminFatwaEditorValue = Omit<AdminArticleEditorValue, "excerpt" | "bodyMarkdown"> & {
  fatwaNumber: string;
  question: string;
  answer: string;
};

type ContentEntryRow = {
  id: string;
  kind: "article" | "fatwa";
  title: string;
  slug: string;
  excerpt?: string | null;
  body_markdown?: string | null;
  status: AdminContentStatus;
  published_at: string | null;
  scheduled_at?: string | null;
  updated_at: string;
  views_count: number;
  seo_score: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  categories: { name: string } | null;
};

type AdminFatwaRow = {
  fatwa_number: string;
  question?: string;
  answer?: string;
  content_entries: ContentEntryRow | null;
};

function seedArticleRows(): AdminContentRow[] {
  return articles.map((article) => ({
    id: article.id,
    kind: "article",
    title: article.title,
    slug: article.slug,
    status: "published",
    category: article.category,
    publishedAt: article.date,
    updatedAt: article.date,
    views: article.views,
    seoScore: 86,
  }));
}

function seedFatwaRows(): AdminContentRow[] {
  return fatwas.map((fatwa) => ({
    id: fatwa.number,
    kind: "fatwa",
    title: fatwa.title,
    slug: fatwa.slug,
    status: "published",
    category: fatwa.category,
    publishedAt: fatwa.date,
    updatedAt: fatwa.date,
    views: fatwa.views,
    seoScore: 82,
    fatwaNumber: fatwa.number,
  }));
}

function mapContentRow(row: ContentEntryRow): AdminContentRow {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    slug: row.slug,
    status: row.status,
    category: row.categories?.name ?? "General",
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    views: row.views_count,
    seoScore: row.seo_score,
  };
}

export async function listAdminArticles(status?: AdminContentStatus | "all") {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return seedArticleRows();

  let query = supabase
    .from("content_entries")
    .select("id, kind, title, slug, status, published_at, updated_at, views_count, seo_score, categories(name)")
    .eq("kind", "article")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error || !data) return seedArticleRows();
  return (data as unknown as ContentEntryRow[]).map(mapContentRow);
}

export async function listAdminFatwas(status?: AdminContentStatus | "all") {
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) return seedFatwaRows();

  let query = supabase
    .from("fatwas")
    .select("fatwa_number, content_entries!inner(id, kind, title, slug, status, published_at, updated_at, views_count, seo_score, categories(name))")
    .eq("content_entries.kind", "fatwa")
    .is("content_entries.deleted_at", null)
    .order("updated_at", { referencedTable: "content_entries", ascending: false });

  if (status && status !== "all") {
    query = query.eq("content_entries.status", status);
  }

  const { data, error } = await query;
  if (error || !data) return seedFatwaRows();

  return (data as unknown as AdminFatwaRow[]).flatMap((row) => {
    if (!row.content_entries) return [];
    return [{ ...mapContentRow(row.content_entries), fatwaNumber: row.fatwa_number }];
  });
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export async function getAdminArticleForEdit(id: string): Promise<AdminArticleEditorValue | null> {
  const seed = articles.find((article) => article.id === id || article.slug === id);
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) {
    return seed ? {
      id: seed.id,
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      bodyMarkdown: seed.body.join("\n\n"),
      category: seed.category,
      tags: seed.tags.join(", "),
      status: "published",
      scheduledAt: "",
      seoTitle: seed.title,
      seoDescription: seed.excerpt,
    } : null;
  }

  const { data, error } = await supabase
    .from("content_entries")
    .select("id, title, slug, excerpt, body_markdown, status, scheduled_at, seo_title, seo_description, categories(name), content_tags(tags(name))")
    .eq("id", id)
    .eq("kind", "article")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as ContentEntryRow & { content_tags?: { tags: { name: string } | null }[] };

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    bodyMarkdown: row.body_markdown ?? "",
    category: row.categories?.name ?? "",
    tags: row.content_tags?.map((item) => item.tags?.name).filter(Boolean).join(", ") ?? "",
    status: row.status,
    scheduledAt: toDateTimeLocal(row.scheduled_at),
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
  };
}

export async function getAdminFatwaForEdit(id: string): Promise<AdminFatwaEditorValue | null> {
  const seed = fatwas.find((fatwa) => fatwa.number === id || fatwa.slug === id);
  const supabase = await createOptionalSupabaseServerClient();
  if (!supabase) {
    return seed ? {
      id: seed.number,
      fatwaNumber: seed.number,
      title: seed.title,
      slug: seed.slug,
      question: seed.question,
      answer: seed.answer,
      category: seed.category,
      tags: seed.tags.join(", "),
      status: "published",
      scheduledAt: "",
      seoTitle: seed.title,
      seoDescription: seed.question,
    } : null;
  }

  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, content_entries!inner(id, title, slug, status, scheduled_at, seo_title, seo_description, categories(name), content_tags(tags(name)))")
    .eq("content_id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as AdminFatwaRow & {
    content_entries: (ContentEntryRow & { content_tags?: { tags: { name: string } | null }[] }) | null;
  };
  if (!row.content_entries) return null;

  return {
    id: row.content_entries.id,
    fatwaNumber: row.fatwa_number,
    title: row.content_entries.title,
    slug: row.content_entries.slug,
    question: row.question ?? "",
    answer: row.answer ?? "",
    category: row.content_entries.categories?.name ?? "",
    tags: row.content_entries.content_tags?.map((item) => item.tags?.name).filter(Boolean).join(", ") ?? "",
    status: row.content_entries.status,
    scheduledAt: toDateTimeLocal(row.content_entries.scheduled_at),
    seoTitle: row.content_entries.seo_title ?? "",
    seoDescription: row.content_entries.seo_description ?? "",
  };
}
