"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Eye, Save, Send } from "lucide-react";
import type { EditorActionState } from "@/app/admin/_actions/content-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "./markdown-editor";
import { marked } from "marked";

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
  author?: string;
  tags?: string;
  references?: string[];
  givenBy?: string[];
  status?: "draft" | "scheduled" | "published" | "archived";
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const initialState: EditorActionState = {
  status: "idle",
  message: "",
};

export function ContentEditorForm({ 
  action, 
  initialValue, 
  kind,
  categories = [],
  authors = []
}: { 
  action: EditorAction; 
  initialValue?: EditorInitialValue; 
  kind: EditorKind;
  categories?: string[];
  authors?: string[];
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [body, setBody] = useState(initialValue?.bodyMarkdown ?? initialValue?.answer ?? "");
  const [seoDescription, setSeoDescription] = useState(initialValue?.seoDescription ?? "");
  const [fatwaNumber, setFatwaNumber] = useState(initialValue?.fatwaNumber ?? "");
  const [question, setQuestion] = useState(initialValue?.question ?? "");
  const [excerpt, setExcerpt] = useState(initialValue?.excerpt ?? "");
  const [seoTitle, setSeoTitle] = useState(initialValue?.seoTitle ?? "");
  const [status, setStatus] = useState(initialValue?.status ?? "draft");
  const [category, setCategory] = useState(initialValue?.category ?? "");
  const [author, setAuthor] = useState(initialValue?.author ?? "മുഈനുദ്ദീൻ ബാഖവി");
  const [givenBy, setGivenBy] = useState(initialValue?.givenBy?.join(", ") ?? "മുഈനുദ്ദീൻ ബാഖവി");
  const [references, setReferences] = useState(initialValue?.references?.join(", ") ?? "");
  const [tags, setTags] = useState(initialValue?.tags ?? "");
  
  const [showPreview, setShowPreview] = useState(false);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewAuthor, setIsNewAuthor] = useState(false);

  const seoScore = useMemo(() => {
    let score = 20;
    if (title.length >= 8 && title.length <= 70) score += 25;
    if (slug.length >= 3) score += 15;
    if (seoDescription.length >= 80 && seoDescription.length <= 160) score += 25;
    if (body.length >= 400) score += 15;
    return Math.min(score, 100);
  }, [body.length, seoDescription.length, slug.length, title.length]);

  return (
    <>
      <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {initialValue?.id ? <input type="hidden" name="id" value={initialValue.id} /> : null}
        {initialValue?.slug ? <input type="hidden" name="previousSlug" value={initialValue.slug} /> : null}
        <div className="grid gap-5">
          {kind === "fatwa" && initialValue?.fatwaNumber ? (
            <Input 
              name="fatwaNumber" 
              value={fatwaNumber} 
              readOnly 
              className="bg-muted text-muted-foreground"
              title="Fatwa number is auto-generated and read-only"
            />
          ) : null}
          
          <div className="space-y-1">
            <Input 
              name="title" 
              value={title} 
              onChange={(event) => setTitle(event.target.value)} 
              placeholder={kind === "article" ? "ലേഖനത്തിന്റെ തലക്കെട്ട്" : "ഫത്വയുടെ തലക്കെട്ട്"} 
              className="text-3xl font-bold h-auto py-3 leading-snug"
              required 
            />
          </div>

          <Input 
            name="slug" 
            value={slug} 
            onChange={(event) => setSlug(event.target.value)} 
            placeholder="manual-slug-in-english" 
            required 
          />
          
          {kind === "fatwa" ? (
            <>
              <Textarea 
                name="question" 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                placeholder="ചോദ്യം" 
                className="min-h-40" 
                required 
              />
              <div className="mt-2">
                <MarkdownEditor 
                  name="answer" 
                  value={body} 
                  onChange={setBody} 
                  placeholder="മറുപടി (മാർക്ക്ഡൗൺ ഉപയോഗിക്കാം)" 
                />
              </div>
            </>
          ) : (
            <>
              <Textarea 
                name="excerpt" 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                placeholder="Excerpt / short description (shows in list with ...read more)" 
                required 
              />
              <MarkdownEditor 
                name="bodyMarkdown" 
                value={body} 
                onChange={setBody} 
                placeholder="Write your article content here in Malayalam..." 
              />
            </>
          )}
          <Card>
            <CardContent className="grid gap-4 pt-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">SEO</h2>
                <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">{seoScore}/100</span>
              </div>
              <Input 
                name="seoTitle" 
                value={seoTitle} 
                onChange={(e) => setSeoTitle(e.target.value)} 
                placeholder="SEO title" 
              />
              <Textarea 
                name="seoDescription" 
                value={seoDescription} 
                onChange={(event) => setSeoDescription(event.target.value)} 
                placeholder="SEO description" 
              />
            </CardContent>
          </Card>
        </div>
        <aside className="grid h-fit gap-5">
          <Card>
            <CardContent className="grid gap-4 pt-5">
              <h2 className="font-bold">Publish</h2>
              
              <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="w-full">
                <Eye className="mr-2 size-4" />Preview
              </Button>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button type="submit" name="status" value="draft" variant="secondary" disabled={isPending} onClick={() => setStatus("draft")}>
                  Save Draft
                </Button>
                <Button type="submit" name="status" value="published" variant="default" disabled={isPending} onClick={() => setStatus("published")}>
                  Publish
                </Button>
              </div>
              
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
              <h2 className="font-bold">Details</h2>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Category</label>
                  <button type="button" onClick={() => { setIsNewCategory(!isNewCategory); setCategory(""); }} className="text-xs text-primary font-medium hover:underline">
                    {isNewCategory ? "Select Existing" : "+ Add New"}
                  </button>
                </div>
                {isNewCategory ? (
                  <Input 
                    name="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="Type new category..." 
                    required 
                  />
                ) : (
                  <select 
                    name="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    {!categories.includes(category) && category !== "" && <option value={category}>{category}</option>}
                  </select>
                )}
              </div>

              {kind === "article" ? (
                <div className="space-y-1 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold">Author</label>
                    <button type="button" onClick={() => { setIsNewAuthor(!isNewAuthor); setAuthor(""); }} className="text-xs text-primary font-medium hover:underline">
                      {isNewAuthor ? "Select Existing" : "+ Add New"}
                    </button>
                  </div>
                  {isNewAuthor ? (
                    <Input 
                      name="author" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                      placeholder="Type new author..." 
                      required 
                    />
                  ) : (
                    <select 
                      name="author" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      required
                    >
                      <option value="" disabled>Select author...</option>
                      {authors.map((a) => <option key={a} value={a}>{a}</option>)}
                      {!authors.includes(author) && author !== "" && <option value={author}>{author}</option>}
                    </select>
                  )}
                </div>
              ) : (
                <div className="space-y-1 mt-4">
                  <label className="text-sm font-semibold">Fatwa Given By</label>
                  <Input 
                    name="givenBy" 
                    value={givenBy} 
                    onChange={(e) => setGivenBy(e.target.value)} 
                    placeholder="Comma separated names..." 
                    required 
                  />
                </div>
              )}

              <div className="space-y-1 mt-4">
                <label className="text-sm font-semibold">Tags</label>
                <Input 
                  name="tags" 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="Comma separated..." 
                />
              </div>

              {kind === "fatwa" && (
                <div className="space-y-1 mt-4">
                  <label className="text-sm font-semibold">References</label>
                  <Input 
                    name="references" 
                    value={references} 
                    onChange={(e) => setReferences(e.target.value)} 
                    placeholder="Comma separated references..." 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </form>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-12">
          <div className="relative w-full max-w-4xl max-h-full overflow-y-auto rounded-lg border bg-background p-8 shadow-2xl">
            <Button type="button" variant="outline" className="absolute right-8 top-8" onClick={() => setShowPreview(false)}>Close Preview</Button>
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold mb-12">{title || "Untitled Preview"}</h1>
              <div className="prose-platform text-lg leading-loose text-foreground/90 space-y-6" dangerouslySetInnerHTML={{ __html: marked.parse(body, { breaks: true }) as string }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
