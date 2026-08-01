import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listCategories(kind: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("name").eq("kind", kind);
  return data?.map(c => c.name) || [];
}

export async function listAuthors() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("authors").select("name");
  return data?.map(a => a.name) || [];
}

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
  author: string;
  tags: string;
  status: AdminContentStatus;
  scheduledAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type AdminFatwaEditorValue = Omit<AdminArticleEditorValue, "excerpt" | "bodyMarkdown" | "author"> & {
  fatwaNumber: string;
  question: string;
  answer: string;
  references: string[];
  givenBy: string[];
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
  authors?: { name: string } | null;
};

type AdminFatwaRow = {
  fatwa_number: string;
  question?: string;
  answer?: string;
  references?: string[];
  given_by?: string[];
  content_entries: ContentEntryRow | null;
};

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
  const supabase = await createSupabaseServerClient();
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
  if (error || !data) return [];
  return (data as unknown as ContentEntryRow[]).map(mapContentRow);
}

export async function listAdminFatwas(status?: AdminContentStatus | "all") {
  const supabase = await createSupabaseServerClient();
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
  if (error || !data) return [];

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
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("id, title, slug, excerpt, body_markdown, status, scheduled_at, seo_title, seo_description, categories(name), authors(name), content_tags(tags(name))")
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
    author: row.authors?.name ?? "മുഈനുദ്ദീൻ ബാഖവി",
    tags: row.content_tags?.map((item) => item.tags?.name).filter(Boolean).join(", ") ?? "",
    status: row.status,
    scheduledAt: toDateTimeLocal(row.scheduled_at),
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
  };
}

export async function getAdminFatwaForEdit(id: string): Promise<AdminFatwaEditorValue | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fatwas")
    .select("fatwa_number, question, answer, references, given_by, content_entries!inner(id, title, slug, status, scheduled_at, seo_title, seo_description, categories(name), authors(name), content_tags(tags(name)))")
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
    references: row.references ?? [],
    givenBy: row.given_by ?? ["മുഈനുദ്ദീൻ ബാഖവി"],
    category: row.content_entries.categories?.name ?? "",
    tags: row.content_entries.content_tags?.map((item) => item.tags?.name).filter(Boolean).join(", ") ?? "",
    status: row.content_entries.status,
    scheduledAt: toDateTimeLocal(row.content_entries.scheduled_at),
    seoTitle: row.content_entries.seo_title ?? "",
    seoDescription: row.content_entries.seo_description ?? "",
  };
}

export async function getAdminDashboardStats() {
  const supabase = await createSupabaseServerClient();
  
  const [published, fatwas, users] = await Promise.all([
    supabase.from("content_entries").select("*", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
    supabase.from("content_entries").select("*", { count: "exact", head: true }).eq("kind", "fatwa").is("deleted_at", null),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return {
    published: published.count ?? 0,
    fatwas: fatwas.count ?? 0,
    media: 0, // Storage API count requires listing files, keep static or 0 for now
    users: users.count ?? 0,
  };
}

export type AdminClassSubjectRow = {
  id: string;
  title: string;
  slug: string;
  youtubeUrl: string;
  classesCount: number;
  progressPercent: number;
};

export async function listAdminClassSubjects(): Promise<AdminClassSubjectRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("class_subjects")
    .select("id, title, slug, youtube_playlists(youtube_playlist_id, classes_count, progress_percent)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((row) => {
    const playlist = row.youtube_playlists?.[0];
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      youtubeUrl: playlist ? `https://youtube.com/playlist?list=${playlist.youtube_playlist_id}` : "",
      classesCount: playlist?.classes_count ?? 0,
      progressPercent: playlist?.progress_percent ?? 0,
    };
  });
}

export async function getAdminClassSubjectForEdit(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("class_subjects")
    .select("id, title, slug, description, youtube_playlists(youtube_playlist_id, classes_count, progress_percent)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const playlist = data.youtube_playlists?.[0];
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description ?? "",
    youtubeUrl: playlist ? `https://youtube.com/playlist?list=${playlist.youtube_playlist_id}` : "",
    classesCount: playlist?.classes_count ?? 0,
    progressPercent: playlist?.progress_percent ?? 0,
  };
}
