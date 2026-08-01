"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Image as ImageIcon } from "lucide-react";
import { AdminBookEditorValue } from "@/lib/admin-content-repository";
import { EditorActionState, createBookAction, updateBookAction } from "@/app/admin/_actions/content-actions";
import { slugify } from "@/lib/utils";
import { uploadMediaAction } from "@/app/admin/_actions/media-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "./markdown-editor";

export function BookEditorForm({ initialValue }: { initialValue?: AdminBookEditorValue }) {
  const router = useRouter();
  const formAction = initialValue?.id ? updateBookAction : createBookAction;
  
  const [state, action, isPending] = useActionState<EditorActionState, FormData>(formAction, {
    status: "idle",
    message: "",
  });

  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  const [body, setBody] = useState(initialValue?.bodyMarkdown ?? "");
  
  const [coverMediaId, setCoverMediaId] = useState(initialValue?.coverMediaId ?? "");
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadMediaAction(formData);
      setCoverMediaId(result.id);
      alert("Image uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6">
        <Card>
          <CardContent className="grid gap-5 pt-6">
            {initialValue?.id && <input type="hidden" name="id" value={initialValue.id} />}
            <input type="hidden" name="coverMediaId" value={coverMediaId} />
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Book Title</label>
              <Input name="title" value={title} onChange={handleTitleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Slug (URL)</label>
              <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Author</label>
              <Input name="author" defaultValue={initialValue?.author} required placeholder="e.g. Imam Ghazali" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Short Description (Excerpt)</label>
              <Textarea name="excerpt" defaultValue={initialValue?.excerpt} rows={3} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Detailed Description (Markdown)</label>
              <MarkdownEditor 
                name="bodyMarkdown" 
                value={body} 
                onChange={setBody} 
                placeholder="Write detailed book description..." 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Download or Purchase Link</label>
              <Input name="downloadLink" defaultValue={initialValue?.downloadLink ?? ""} placeholder="https://..." />
              <p className="text-xs text-muted-foreground">Leave empty if not available.</p>
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
              {isPending ? "Saving..." : initialValue?.id ? "Update Book" : "Create Book"}
            </Button>
            
            {state.status === "error" && (
              <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-bold flex items-center gap-2"><ImageIcon className="size-4" /> Cover Image</h3>
            
            {coverMediaId && <div className="mb-4 aspect-video rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">Image selected</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Upload Book Cover</label>
              <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
