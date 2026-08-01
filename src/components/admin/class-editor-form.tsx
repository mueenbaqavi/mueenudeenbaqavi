"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import type { EditorActionState } from "@/app/admin/_actions/content-actions";

type ClassEditorFormProps = {
  action: (state: EditorActionState, payload: FormData) => Promise<EditorActionState>;
  initialValue?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    youtubeUrl: string;
    classesCount: number;
  };
};

export function ClassEditorForm({ action, initialValue }: ClassEditorFormProps) {
  const [state, formAction, isPending] = useActionState(action, { status: "idle", message: "" });
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialValue?.youtubeUrl ?? "");
  const [classesCount, setClassesCount] = useState(initialValue?.classesCount?.toString() ?? "0");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  return (
    <form action={formAction} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-5 pt-6">
          {initialValue?.id && <input type="hidden" name="id" value={initialValue.id} />}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Title</label>
            <Input 
              name="title" 
              value={title} 
              onChange={handleTitleChange} 
              placeholder="e.g. Fiqh Class" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug</label>
            <Input 
              name="slug" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              placeholder="e.g. fiqh-class" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <Textarea 
              name="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Short description of the class subject..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">YouTube Playlist URL</label>
            <Input 
              name="youtubeUrl" 
              value={youtubeUrl} 
              onChange={(e) => setYoutubeUrl(e.target.value)} 
              placeholder="https://www.youtube.com/playlist?list=..." 
              required 
            />
            <p className="text-xs text-muted-foreground">
              Paste the full URL to the YouTube playlist. It must contain list=...
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Total Classes</label>
            <Input 
              type="number"
              name="classesCount" 
              value={classesCount}
              onChange={(e) => setClassesCount(e.target.value)}
              min="0"
              required 
            />
            <p className="text-xs text-muted-foreground">
              Number of videos in the playlist.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Class"}
          </Button>

          {state.status !== "idle" && (
            <div className={`rounded-md border p-3 text-sm ${state.status === "success" ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
              <p>{state.message}</p>
              {state.path && <Link href={state.path} className="mt-2 inline-block font-bold text-primary">View published class</Link>}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
