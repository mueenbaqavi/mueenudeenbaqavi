"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { AdminAhluSunnahEditorValue } from "@/lib/admin-content-repository";
import { EditorActionState, createAhluSunnahAction, updateAhluSunnahAction } from "@/app/admin/_actions/content-actions";
import { slugify } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "./markdown-editor";

export function AhluSunnahEditorForm({ initialValue }: { initialValue?: AdminAhluSunnahEditorValue }) {
  const router = useRouter();
  const formAction = initialValue?.id ? updateAhluSunnahAction : createAhluSunnahAction;
  
  const [state, action, isPending] = useActionState<EditorActionState, FormData>(formAction, {
    status: "idle",
    message: "",
  });

  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [body, setBody] = useState(initialValue?.bodyMarkdown ?? "");

  useEffect(() => {
    if (state.status === "success" && state.path) {
      router.push(state.path);
    }
  }, [state, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6">
        <Card>
          <CardContent className="grid gap-5 pt-6">
            {initialValue?.id && <input type="hidden" name="id" value={initialValue.id} />}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Title</label>
              <Input name="title" value={title} onChange={handleTitleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Slug (URL)</label>
              <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Excerpt</label>
              <Textarea name="excerpt" defaultValue={initialValue?.excerpt} rows={3} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Content (Markdown)</label>
              <MarkdownEditor 
                name="bodyMarkdown" 
                value={body} 
                onChange={setBody} 
                placeholder="Write your content here in Malayalam..." 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 auto-rows-max">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-bold">Publishing</h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <select name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue={initialValue?.status ?? "draft"}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            
            <Button type="submit" className="mt-6 w-full" disabled={isPending}>
              {isPending ? "Saving..." : initialValue?.id ? "Update Content" : "Create Content"}
            </Button>
            
            {state.status === "error" && (
              <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
