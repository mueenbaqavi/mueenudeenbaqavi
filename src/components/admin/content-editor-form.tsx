"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { CalendarClock, Eye, Save, Send, Sparkles, Upload } from "lucide-react";
import type { EditorActionState } from "@/app/admin/_actions/content-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data/content";
import { slugify } from "@/lib/utils";

type EditorKind = "article" | "fatwa";
type EditorAction = (state: EditorActionState, formData: FormData) => Promise<EditorActionState>;
type EditorInitialValue = {
  id?: string;
  fatwaNumber?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  bodyMarkdown?: string;
  question?: string;
  answer?: string;
  category?: string;
  tags?: string;
  status?: "draft" | "scheduled" | "published" | "archived";
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const initialState: EditorActionState = {
  status: "idle",
  message: "",
};

export function ContentEditorForm({ action, initialValue, kind }: { action: EditorAction; initialValue?: EditorInitialValue; kind: EditorKind }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [body, setBody] = useState(initialValue?.bodyMarkdown ?? initialValue?.answer ?? "");
  const [seoDescription, setSeoDescription] = useState(initialValue?.seoDescription ?? "");

  const seoScore = useMemo(() => {
    let score = 20;
    if (title.length >= 8 && title.length <= 70) score += 25;
    if (slug.length >= 3) score += 15;
    if (seoDescription.length >= 80 && seoDescription.length <= 160) score += 25;
    if (body.length >= 400) score += 15;
    return Math.min(score, 100);
  }, [body.length, seoDescription.length, slug.length, title.length]);

  function updateTitle(value: string) {
    setTitle(value);
    const generatedSlug = slugify(value);
    if (!slug || slug === slugify(title)) setSlug(generatedSlug);
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {initialValue?.id ? <input type="hidden" name="id" value={initialValue.id} /> : null}
      {initialValue?.slug ? <input type="hidden" name="previousSlug" value={initialValue.slug} /> : null}
      <div className="grid gap-5">
        {kind === "fatwa" ? <Input name="fatwaNumber" defaultValue={initialValue?.fatwaNumber ?? ""} placeholder="Fatwa number, e.g. MBF-0003" required /> : null}
        <Input name="title" value={title} onChange={(event) => updateTitle(event.target.value)} placeholder={kind === "article" ? "ലേഖനത്തിന്റെ തലക്കെട്ട്" : "ഫത്വയുടെ തലക്കെട്ട്"} required />
        <Input name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="auto-generated-slug" required />
        {kind === "fatwa" ? (
          <>
            <Textarea name="question" defaultValue={initialValue?.question ?? ""} placeholder="ചോദ്യം" className="min-h-40" required />
            <Textarea name="answer" value={body} onChange={(event) => setBody(event.target.value)} placeholder="മറുപടി" className="min-h-72" required />
          </>
        ) : (
          <>
            <Textarea name="excerpt" defaultValue={initialValue?.excerpt ?? ""} placeholder="Excerpt" required />
            <Textarea name="bodyMarkdown" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Markdown / rich text body" className="min-h-96" required />
          </>
        )}
        <Card>
          <CardContent className="grid gap-4 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">SEO</h2>
              <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">{seoScore}/100</span>
            </div>
            <Input name="seoTitle" defaultValue={initialValue?.seoTitle ?? ""} placeholder="SEO title" />
            <Textarea name="seoDescription" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} placeholder="SEO description" />
          </CardContent>
        </Card>
      </div>
      <aside className="grid h-fit gap-5">
        <Card>
          <CardContent className="grid gap-4 pt-5">
            <h2 className="font-bold">Publish</h2>
            <select name="status" defaultValue={initialValue?.status ?? "draft"} className="h-11 rounded-md border bg-background px-3 text-sm">
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Input name="scheduledAt" type="datetime-local" defaultValue={initialValue?.scheduledAt ?? ""} aria-label="Schedule publish date" />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline"><Eye className="size-4" />Preview</Button>
              <Button type="button" variant="secondary"><Save className="size-4" />Autosave</Button>
            </div>
            <Button type="submit" disabled={isPending}><Send className="size-4" />{isPending ? "Saving..." : "Save"}</Button>
            {state.status !== "idle" ? (
              <div className={state.status === "success" ? "rounded-md border border-primary/30 bg-secondary p-3 text-sm" : "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>
                <p>{state.message}</p>
                {state.path ? <Link href={state.path} className="mt-2 inline-block font-bold text-primary">Open published page</Link> : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-4 pt-5">
            <h2 className="font-bold">Taxonomy</h2>
            <select name="category" defaultValue={initialValue?.category ?? categories[0]} className="h-11 rounded-md border bg-background px-3 text-sm">
              {initialValue?.category && !categories.includes(initialValue.category) ? <option>{initialValue.category}</option> : null}
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <Input name="tags" defaultValue={initialValue?.tags ?? ""} placeholder="Tags separated by comma" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 pt-5">
            <h2 className="font-bold">Media</h2>
            <Button type="button" variant="outline"><Upload className="size-4" />Upload Image</Button>
            <Button type="button" variant="outline"><Sparkles className="size-4" />Generate OG</Button>
            <Button type="button" variant="outline"><CalendarClock className="size-4" />Revision History</Button>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
