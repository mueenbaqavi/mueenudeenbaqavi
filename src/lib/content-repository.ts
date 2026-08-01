import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContentItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  arabicQuote?: string;
  category: string;
  date: string;
  readTime: string;
  views: number;
  author: string;
  image: string;
  tags: string[];
};

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
  authors?: { name: string } | null;
  media_assets?: { bucket: string; path: string } | null;
};

type FatwaRow = {
  fatwa_number: string;
  question: string;
  answer: string;
  references: string[];
  given_by: string[];
  content_entries: ContentEntryRow | null;
};

type BookRow = {
  purchase_url: string | null;
  content_entries: ContentEntryRow | null;
};

type CourseRow = {
  duration: string | null;
  topics: string[];
  eligibility: string | null;
  instructor: string | null;
  cta_buttons: { label: string; whatsappNumber: string; whatsappMessage: string }[];
  content_entries: ContentEntryRow | null;
};

type ClassSubjectRow = {
  title: string;
  slug: string;
  description: string | null;
  youtube_playlists: { classes_count: number; progress_percent: number }[];
};

function mapContentRow(row: ContentEntryRow, image = "/images/article-emerald.svg"): ContentItem {
  return {
    id: row.slug,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    body: row.body_markdown ?? "",
    category: row.categories?.name ?? "General",
    date: row.published_at ?? new Date().toISOString(),
    readTime: `${row.read_time_minutes ?? 1} മിനിറ്റ്`,
    views: row.views_count ?? 0,
    author: row.authors?.name ?? row.profiles?.full_name ?? "മുഈനുദ്ദീൻ ബാഖവി",
    image,
    tags: [],
  };
}

export async function listPublishedArticles() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name), authors(name)")
    .eq("kind", "article")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return [];
  return (data as unknown as ContentEntryRow[]).map((row) => mapContentRow(row));
}

export async function getPublishedArticleBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name), authors(name)")
    .eq("kind", "article")
    .eq("status", "published")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  return mapContentRow(data as unknown as ContentEntryRow);
}

export async function listPublishedAhluSunnahArticles() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name)")
    .eq("kind", "ahlu_sunnah")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return [];
  return (data as unknown as ContentEntryRow[]).map((row) => mapContentRow(row, "/images/article-gold.svg"));
}

export async function listPublishedFatwas() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, references, given_by, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name))")
    .eq("content_entries.kind", "fatwa")
    .eq("content_entries.status", "published")
    .is("content_entries.deleted_at", null)
    .order("published_at", { referencedTable: "content_entries", ascending: false });

  if (error || !data?.length) return [];

  return (data as unknown as FatwaRow[]).flatMap((row) => {
    if (!row.content_entries) return [];
    return [{
      number: row.fatwa_number,
      title: row.content_entries.title,
      slug: row.content_entries.slug,
      question: row.question,
      answer: row.answer,
      references: row.references ?? [],
      givenBy: row.given_by ?? ["മുഈനുദ്ദീൻ ബാഖവി"],
      category: row.content_entries.categories?.name ?? "General",
      tags: [],
      date: row.content_entries.published_at ?? new Date().toISOString(),
      views: row.content_entries.views_count ?? 0,
      readTime: `${row.content_entries.read_time_minutes ?? 1} മിനിറ്റ്`,
      excerpt: row.content_entries.excerpt ?? "",
    }];
  });
}

export async function getPublishedFatwaBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, references, given_by, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name))")
    .eq("content_entries.kind", "fatwa")
    .eq("content_entries.status", "published")
    .eq("content_entries.slug", slug)
    .is("content_entries.deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as FatwaRow;
  if (!row.content_entries) return null;

  return {
    number: row.fatwa_number,
    title: row.content_entries.title,
    slug: row.content_entries.slug,
    question: row.question,
    answer: row.answer,
    references: row.references ?? [],
    givenBy: row.given_by ?? ["മുഈനുദ്ദീൻ ബാഖവി"],
    category: row.content_entries.categories?.name ?? "General",
    tags: [],
    date: row.content_entries.published_at ?? new Date().toISOString(),
    views: row.content_entries.views_count ?? 0,
    readTime: `${row.content_entries.read_time_minutes ?? 1} മിനിറ്റ്`,
  };
}

export async function listPublishedBooks() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("books")
    .select("purchase_url, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name))")
    .eq("content_entries.kind", "book")
    .eq("content_entries.status", "published")
    .is("content_entries.deleted_at", null)
    .order("published_at", { referencedTable: "content_entries", ascending: false });

  if (error || !data?.length) return [];
  return (data as unknown as BookRow[]).flatMap((row) => {
    if (!row.content_entries) return [];
    return [{
      title: row.content_entries.title,
      slug: row.content_entries.slug,
      category: row.content_entries.categories?.name ?? "General",
      description: row.content_entries.excerpt ?? "",
      cover: "/images/book-cover.svg",
      pages: 128, // Currently static fallback if not stored
      status: "Download Available",
      date: row.content_entries.published_at ?? new Date().toISOString(),
    }];
  });
}

export async function getPublishedBookBySlug(slug: string) {
  const books = await listPublishedBooks();
  return books.find((b) => b.slug === slug) ?? null;
}

export async function listPublishedCourses() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select("duration, topics, eligibility, instructor, cta_buttons, content_entries!inner(title, slug, excerpt, body_markdown, published_at, read_time_minutes, views_count, categories(name), profiles:profiles!content_entries_author_id_fkey(full_name), media_assets!cover_media_id(bucket, path))")
    .eq("content_entries.kind", "course")
    .eq("content_entries.status", "published")
    .is("content_entries.deleted_at", null)
    .order("published_at", { referencedTable: "content_entries", ascending: false });

  if (error || !data?.length) return [];
  return (data as unknown as CourseRow[]).flatMap((row) => {
    if (!row.content_entries) return [];
    return [{
      title: row.content_entries.title,
      slug: row.content_entries.slug,
      description: row.content_entries.excerpt ?? "",
      duration: row.duration ?? "Unknown",
      topics: row.topics ?? [],
      eligibility: row.eligibility ?? "Open",
      instructor: row.instructor ?? "മുഈനുദ്ദീൻ ബാഖവി",
      ctaButtons: row.cta_buttons ?? [],
      image: row.content_entries.media_assets ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${row.content_entries.media_assets.bucket}/${row.content_entries.media_assets.path}` : null,
      date: row.content_entries.published_at ?? new Date().toISOString(),
    }];
  });
}

export async function getPublishedCourseBySlug(slug: string) {
  const courses = await listPublishedCourses();
  return courses.find((c) => c.slug === slug) ?? null;
}

export async function listClassSubjects() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("class_subjects")
    .select("title, slug, description, youtube_playlists(youtube_playlist_id, classes_count, progress_percent)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];
  return (data as any[]).map((row) => {
    const playlist = row.youtube_playlists?.[0];
    return {
      subject: row.title,
      slug: row.slug,
      description: row.description ?? "",
      playlist: "YouTube Playlist",
      youtubePlaylistId: playlist?.youtube_playlist_id ?? "",
      classes: playlist?.classes_count ?? 0,
      progress: playlist?.progress_percent ?? 0,
    };
  });
}

export async function getClassSubjectBySlug(slug: string) {
  const subjects = await listClassSubjects();
  return subjects.find((s) => s.slug === slug) ?? null;
}
