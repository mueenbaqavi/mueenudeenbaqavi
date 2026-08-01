"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { articleEditorSchema, fatwaEditorSchema } from "@/lib/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type EditorActionState = {
  status: "idle" | "success" | "error";
  message: string;
  path?: string;
};

const initialErrorState: EditorActionState = {
  status: "error",
  message: "Unable to save. Please check the form and try again.",
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getCommaArray(formData: FormData, key: string) {
  return getString(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function estimateReadTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function scoreSeo({ title, slug, description, body }: { title: string; slug: string; description?: string; body: string }) {
  let score = 20;
  if (title.length >= 8 && title.length <= 70) score += 25;
  if (slug.length >= 3) score += 15;
  if (description && description.length >= 80 && description.length <= 160) score += 25;
  if (body.length >= 400) score += 15;
  return Math.min(score, 100);
}

async function requireEditor() {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { ok: false as const, supabase, error: "Please sign in before saving content." };
  }

  // Ensure user has admin profile via service role to bypass RLS errors
  const { createSupabaseAdminClient } = await import("@/lib/supabase/server");
  const adminClient = createSupabaseAdminClient();
  
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!profile) {
    await adminClient.from("profiles").insert({
      id: authData.user.id,
      full_name: authData.user.email?.split("@")[0] || "Admin",
      role: "admin",
    });
  } else if (profile.role !== "admin" && profile.role !== "editor") {
    await adminClient.from("profiles").update({ role: "admin" }).eq("id", authData.user.id);
  }

  return { ok: true as const, supabase, userId: authData.user.id };
}

async function getOrCreateCategory(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, kind: string, name: string) {
  const slug = slugify(name);
  const { data, error } = await supabase
    .from("categories")
    .upsert({ kind, name, slug }, { onConflict: "kind,slug" })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

async function getOrCreateAuthor(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, name: string) {
  if (!name) return null;
  const slug = slugify(name);
  const { data, error } = await supabase
    .from("authors")
    .upsert({ name, slug }, { onConflict: "slug" })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

async function attachTags(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, contentId: string, tags: string[]) {
  const uniqueTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
  if (uniqueTags.length === 0) return;

  const { data, error } = await supabase
    .from("tags")
    .upsert(uniqueTags.map((name) => ({ name, slug: slugify(name) })), { onConflict: "slug" })
    .select("id");

  if (error) throw error;
  if (!data?.length) return;

  const { error: joinError } = await supabase
    .from("content_tags")
    .insert(data.map((tag) => ({ content_id: contentId, tag_id: tag.id })));

  if (joinError) throw joinError;
}

async function replaceTags(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, contentId: string, tags: string[]) {
  const { error } = await supabase.from("content_tags").delete().eq("content_id", contentId);
  if (error) throw error;
  await attachTags(supabase, contentId, tags);
}

async function writeRevision(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, contentId: string, actorId: string) {
  const { data: content, error: contentError } = await supabase
    .from("content_entries")
    .select("*")
    .eq("id", contentId)
    .single();

  if (contentError) throw contentError;

  const { data: latestRevision } = await supabase
    .from("revisions")
    .select("version")
    .eq("content_id", contentId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = Number(latestRevision?.version ?? 0) + 1;
  const { error: revisionError } = await supabase.from("revisions").insert({
    content_id: contentId,
    version: nextVersion,
    snapshot: content,
    created_by: actorId,
  });

  if (revisionError) throw revisionError;
}

async function writeActivity(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, actorId: string, action: string, contentId: string) {
  await supabase.from("activity_logs").insert({
    actor_id: actorId,
    action,
    entity_table: "content_entries",
    entity_id: contentId,
  });
}

export async function createArticleAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { ...initialErrorState, message: auth.error };

    const parsed = articleEditorSchema.safeParse({
      title: getString(formData, "title"),
      slug: getString(formData, "slug"),
      excerpt: getString(formData, "excerpt"),
      category: getString(formData, "category"),
      tags: getCommaArray(formData, "tags"),
      bodyMarkdown: getString(formData, "bodyMarkdown"),
      status: getString(formData, "status") || "draft",
      scheduledAt: getString(formData, "scheduledAt") || undefined,
      seoTitle: getString(formData, "seoTitle") || undefined,
      seoDescription: getString(formData, "seoDescription") || undefined,
    });

    if (!parsed.success) {
      return { ...initialErrorState, message: parsed.error.issues.map(i => i.message).join(", ") };
    }

    const input = parsed.data;
    const categoryId = await getOrCreateCategory(auth.supabase, "article", input.category);
    const authorName = getString(formData, "author");
    const customAuthorId = await getOrCreateAuthor(auth.supabase, authorName);
    const now = new Date().toISOString();
    const { data, error } = await auth.supabase
      .from("content_entries")
      .insert({
        kind: "article",
        status: input.status,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        body_markdown: input.bodyMarkdown,
        category_id: categoryId,
        author_id: auth.userId,
        custom_author_id: customAuthorId,
        created_by: auth.userId,
        updated_by: auth.userId,
        published_at: input.status === "published" ? now : null,
        scheduled_at: input.status === "scheduled" ? input.scheduledAt : null,
        read_time_minutes: estimateReadTime(input.bodyMarkdown),
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_score: scoreSeo({ title: input.title, slug: input.slug, description: input.seoDescription, body: input.bodyMarkdown }),
      })
      .select("id, slug")
      .single();

    if (error) throw error;
    if (!data?.id || !data.slug) throw new Error("Content insert did not return an id and slug.");
    await attachTags(auth.supabase, data.id, input.tags);
    await writeActivity(auth.supabase, auth.userId, "article.created", data.id);

    revalidatePath("/articles");
    revalidatePath(`/articles/${data.slug}`);

    return { status: "success", message: "Article saved successfully.", path: `/articles/${data.slug}` };
  } catch (error: any) {
    const errorMsg = error?.message || (typeof error === "string" ? error : initialErrorState.message);
    return { ...initialErrorState, message: errorMsg };
  }
}

export async function createFatwaAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { ...initialErrorState, message: auth.error };

    const parsed = fatwaEditorSchema.safeParse({
      fatwaNumber: getString(formData, "fatwaNumber"),
      title: getString(formData, "title"),
      slug: getString(formData, "slug"),
      question: getString(formData, "question"),
      answer: getString(formData, "answer"),
      category: getString(formData, "category"),
      tags: getCommaArray(formData, "tags"),
      references: getCommaArray(formData, "references"),
      givenBy: getCommaArray(formData, "givenBy"),
      status: getString(formData, "status") || "draft",
      scheduledAt: getString(formData, "scheduledAt") || undefined,
      seoTitle: getString(formData, "seoTitle") || undefined,
      seoDescription: getString(formData, "seoDescription") || undefined,
    });

    if (!parsed.success) {
      return { ...initialErrorState, message: parsed.error.issues.map(i => i.message).join(", ") };
    }

    const input = parsed.data;
    const categoryId = await getOrCreateCategory(auth.supabase, "fatwa", input.category);
    const now = new Date().toISOString();

    let finalFatwaNumber = input.fatwaNumber;
    if (!finalFatwaNumber) {
      const { count, error: countError } = await auth.supabase
        .from("fatwas")
        .select("*", { count: "exact", head: true });
      if (countError) throw countError;
      const nextNum = (count || 0) + 1;
      finalFatwaNumber = `MBF-${nextNum.toString().padStart(4, "0")}`;
    }
    const { data, error } = await auth.supabase
      .from("content_entries")
      .insert({
        kind: "fatwa",
        status: input.status,
        title: input.title,
        slug: input.slug,
        excerpt: input.question,
        body_markdown: input.answer,
        category_id: categoryId,
        author_id: auth.userId,
        created_by: auth.userId,
        updated_by: auth.userId,
        published_at: input.status === "published" ? now : null,
        scheduled_at: input.status === "scheduled" ? input.scheduledAt : null,
        read_time_minutes: estimateReadTime(input.answer),
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_score: scoreSeo({ title: input.title, slug: input.slug, description: input.seoDescription, body: input.answer }),
      })
      .select("id, slug")
      .single();

    if (error) throw error;
    if (!data?.id || !data.slug) throw new Error("Content insert did not return an id and slug.");

    const { error: fatwaError } = await auth.supabase.from("fatwas").insert({
      content_id: data.id,
      fatwa_number: finalFatwaNumber,
      question: input.question,
      answer: input.answer,
      references: input.references,
      given_by: input.givenBy.length ? input.givenBy : ["മുഈനുദ്ദീൻ ബാഖവി"],
    });

    if (fatwaError) throw fatwaError;
    await attachTags(auth.supabase, data.id, input.tags);
    await writeActivity(auth.supabase, auth.userId, "fatwa.created", data.id);

    revalidatePath("/fatwas");
    revalidatePath(`/fatwas/${data.slug}`);

    return { status: "success", message: "Fatwa saved successfully.", path: `/fatwas/${data.slug}` };
  } catch (error: any) {
    const errorMsg = error?.message || (typeof error === "string" ? error : initialErrorState.message);
    return { ...initialErrorState, message: errorMsg };
  }
}

export async function updateArticleAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { ...initialErrorState, message: auth.error };

    const id = getString(formData, "id");
    const previousSlug = getString(formData, "previousSlug");
    if (!id) return { ...initialErrorState, message: "Missing article id." };

    const parsed = articleEditorSchema.safeParse({
      title: getString(formData, "title"),
      slug: getString(formData, "slug"),
      excerpt: getString(formData, "excerpt"),
      category: getString(formData, "category"),
      tags: getCommaArray(formData, "tags"),
      bodyMarkdown: getString(formData, "bodyMarkdown"),
      status: getString(formData, "status") || "draft",
      scheduledAt: getString(formData, "scheduledAt") || undefined,
      seoTitle: getString(formData, "seoTitle") || undefined,
      seoDescription: getString(formData, "seoDescription") || undefined,
    });

    if (!parsed.success) {
      return { ...initialErrorState, message: parsed.error.issues.map(i => i.message).join(", ") };
    }

    const input = parsed.data;
    const categoryId = await getOrCreateCategory(auth.supabase, "article", input.category);
    const authorName = getString(formData, "author");
    const customAuthorId = await getOrCreateAuthor(auth.supabase, authorName);
    const now = new Date().toISOString();
    await writeRevision(auth.supabase, id, auth.userId);

    const { error } = await auth.supabase
      .from("content_entries")
      .update({
        status: input.status,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        body_markdown: input.bodyMarkdown,
        category_id: categoryId,
        custom_author_id: customAuthorId,
        updated_by: auth.userId,
        published_at: input.status === "published" ? now : null,
        scheduled_at: input.status === "scheduled" ? input.scheduledAt : null,
        read_time_minutes: estimateReadTime(input.bodyMarkdown),
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_score: scoreSeo({ title: input.title, slug: input.slug, description: input.seoDescription, body: input.bodyMarkdown }),
      })
      .eq("id", id)
      .eq("kind", "article");

    if (error) throw error;
    await replaceTags(auth.supabase, id, input.tags);
    await writeActivity(auth.supabase, auth.userId, "article.updated", id);

    revalidatePath("/admin/articles");
    revalidatePath("/articles");
    revalidatePath(`/articles/${input.slug}`);
    if (previousSlug && previousSlug !== input.slug) revalidatePath(`/articles/${previousSlug}`);

    return { status: "success", message: "Article updated successfully.", path: `/articles/${input.slug}` };
  } catch (error: any) {
    const errorMsg = error?.message || (typeof error === "string" ? error : initialErrorState.message);
    return { ...initialErrorState, message: errorMsg };
  }
}

export async function updateFatwaAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { ...initialErrorState, message: auth.error };

    const id = getString(formData, "id");
    const previousSlug = getString(formData, "previousSlug");
    if (!id) return { ...initialErrorState, message: "Missing fatwa id." };

    const parsed = fatwaEditorSchema.safeParse({
      fatwaNumber: getString(formData, "fatwaNumber"),
      title: getString(formData, "title"),
      slug: getString(formData, "slug"),
      question: getString(formData, "question"),
      answer: getString(formData, "answer"),
      category: getString(formData, "category"),
      tags: getCommaArray(formData, "tags"),
      references: getCommaArray(formData, "references"),
      givenBy: getCommaArray(formData, "givenBy"),
      status: getString(formData, "status") || "draft",
      scheduledAt: getString(formData, "scheduledAt") || undefined,
      seoTitle: getString(formData, "seoTitle") || undefined,
      seoDescription: getString(formData, "seoDescription") || undefined,
    });

    if (!parsed.success) {
      return { ...initialErrorState, message: parsed.error.issues.map(i => i.message).join(", ") };
    }

    const input = parsed.data;
    const categoryId = await getOrCreateCategory(auth.supabase, "fatwa", input.category);
    const now = new Date().toISOString();
    await writeRevision(auth.supabase, id, auth.userId);

    const { error } = await auth.supabase
      .from("content_entries")
      .update({
        status: input.status,
        title: input.title,
        slug: input.slug,
        excerpt: input.question,
        body_markdown: input.answer,
        category_id: categoryId,
        updated_by: auth.userId,
        published_at: input.status === "published" ? now : null,
        scheduled_at: input.status === "scheduled" ? input.scheduledAt : null,
        read_time_minutes: estimateReadTime(input.answer),
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        seo_score: scoreSeo({ title: input.title, slug: input.slug, description: input.seoDescription, body: input.answer }),
      })
      .eq("id", id)
      .eq("kind", "fatwa");

    if (error) throw error;

    const { error: fatwaError } = await auth.supabase
      .from("fatwas")
      .update({
        fatwa_number: input.fatwaNumber || undefined,
        question: input.question,
        answer: input.answer,
        references: input.references,
        given_by: input.givenBy.length ? input.givenBy : ["മുഈനുദ്ദീൻ ബാഖവി"],
      })
      .eq("content_id", id);

    if (fatwaError) throw fatwaError;
    await replaceTags(auth.supabase, id, input.tags);
    await writeActivity(auth.supabase, auth.userId, "fatwa.updated", id);

    revalidatePath("/admin/fatwas");
    revalidatePath("/fatwas");
    revalidatePath(`/fatwas/${input.slug}`);
    if (previousSlug && previousSlug !== input.slug) revalidatePath(`/fatwas/${previousSlug}`);

    return { status: "success", message: "Fatwa updated successfully.", path: `/fatwas/${input.slug}` };
  } catch (error: any) {
    const errorMsg = error?.message || (typeof error === "string" ? error : initialErrorState.message);
    return { ...initialErrorState, message: errorMsg };
  }
}

async function deleteContent(formData: FormData, kind: "article" | "fatwa") {
  const auth = await requireEditor();
  if (!auth.ok) redirect("/login");

  const id = getString(formData, "id");
  const slug = getString(formData, "slug");
  if (!id) throw new Error("Missing content id.");

  // Delete child relations to avoid Foreign Key constraint errors if CASCADE isn't enabled
  await auth.supabase.from("content_tags").delete().eq("content_id", id);
  await auth.supabase.from("revisions").delete().eq("content_id", id);
  await auth.supabase.from("activity_logs").delete().eq("entity_id", id);
  
  if (kind === "fatwa") {
    await auth.supabase.from("fatwas").delete().eq("content_id", id);
  }

  const { error } = await auth.supabase
    .from("content_entries")
    .delete()
    .eq("id", id)
    .eq("kind", kind);

  if (error) throw error;

  await writeActivity(auth.supabase, auth.userId, `${kind}.deleted`, id);
  revalidatePath(kind === "article" ? "/admin/articles" : "/admin/fatwas");
  revalidatePath(kind === "article" ? "/articles" : "/fatwas");
  if (slug) revalidatePath(kind === "article" ? `/articles/${slug}` : `/fatwas/${slug}`);
}

export async function deleteArticleAction(formData: FormData) {
  await deleteContent(formData, "article");
}

export async function deleteFatwaAction(formData: FormData) {
  await deleteContent(formData, "fatwa");
}

export async function createClassSubjectAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { status: "error", message: auth.error };

    const title = getString(formData, "title");
    const slug = getString(formData, "slug") || slugify(title);
    const description = getString(formData, "description");
    const youtubeUrl = getString(formData, "youtubeUrl");

    if (!title || !slug || !youtubeUrl) {
      return { status: "error", message: "Title, slug, and YouTube URL are required." };
    }

    const playlistMatch = youtubeUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const playlistId = playlistMatch ? playlistMatch[1] : null;

    if (!playlistId) {
      return { status: "error", message: "Invalid YouTube Playlist URL. Could not find 'list=' parameter." };
    }

    const classesCount = parseInt(getString(formData, "classesCount") || "0", 10);

    // Insert class subject
    const { data: subject, error: subjectError } = await auth.supabase
      .from("class_subjects")
      .insert({ title, slug, description })
      .select("id")
      .single();

    if (subjectError) throw subjectError;

    // Insert youtube playlist
    const { error: playlistError } = await auth.supabase
      .from("youtube_playlists")
      .insert({
        subject_id: subject.id,
        title: title,
        youtube_playlist_id: playlistId,
        classes_count: classesCount,
        progress_percent: 0,
      });

    if (playlistError) throw playlistError;

    revalidatePath("/admin/classes");
    revalidatePath("/classes");

    return { status: "success", message: "Class added successfully.", path: `/classes/${slug}` };
  } catch (error: any) {
    return { status: "error", message: error?.message || "An error occurred." };
  }
}

export async function deleteClassSubjectAction(formData: FormData) {
  const auth = await requireEditor();
  if (!auth.ok) redirect("/login");

  const id = getString(formData, "id");
  if (!id) throw new Error("Missing class id.");

  // Because of 'on delete cascade', deleting the subject deletes the playlist
  const { error } = await auth.supabase
    .from("class_subjects")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/classes");
  revalidatePath("/classes");
}

export async function editClassSubjectAction(_: EditorActionState, formData: FormData): Promise<EditorActionState> {
  try {
    const auth = await requireEditor();
    if (!auth.ok) return { status: "error", message: auth.error };

    const id = getString(formData, "id");
    const title = getString(formData, "title");
    const slug = getString(formData, "slug");
    const description = getString(formData, "description");
    const youtubeUrl = getString(formData, "youtubeUrl");
    const classesCount = parseInt(getString(formData, "classesCount") || "0", 10);

    if (!id || !title || !slug || !youtubeUrl) {
      return { status: "error", message: "Title, slug, and YouTube URL are required." };
    }

    const playlistMatch = youtubeUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const playlistId = playlistMatch ? playlistMatch[1] : null;

    if (!playlistId) {
      return { status: "error", message: "Invalid YouTube Playlist URL. Could not find 'list=' parameter." };
    }

    // Update class subject
    const { error: subjectError } = await auth.supabase
      .from("class_subjects")
      .update({ title, slug, description, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (subjectError) throw subjectError;

    // Update youtube playlist
    const { error: playlistError } = await auth.supabase
      .from("youtube_playlists")
      .update({
        title: title,
        youtube_playlist_id: playlistId,
        classes_count: classesCount,
        updated_at: new Date().toISOString()
      })
      .eq("subject_id", id);

    if (playlistError) throw playlistError;

    revalidatePath("/admin/classes");
    revalidatePath("/classes");
    revalidatePath(`/classes/${slug}`);

    return { status: "success", message: "Class updated successfully.", path: `/classes/${slug}` };
  } catch (error: any) {
    return { status: "error", message: error?.message || "An error occurred." };
  }
}
