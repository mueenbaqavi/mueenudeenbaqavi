"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import type { EditorActionState } from "@/app/admin/_actions/content-actions";
import { uploadMediaAction } from "@/app/admin/_actions/media-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { AdminCourseEditorValue } from "@/lib/admin-content-repository";

export function CourseEditorForm({ 
  action, 
  initialValue,
}: { 
  action: (state: EditorActionState, formData: FormData) => Promise<EditorActionState>;
  initialValue?: AdminCourseEditorValue;
}) {
  const [state, formAction, isPending] = useActionState(action, { status: "idle", message: "" });
  
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [slug, setSlug] = useState(initialValue?.slug ?? "");
  
  const [ctaButtons, setCtaButtons] = useState<{ label: string; whatsappNumber: string; whatsappMessage: string }[]>(
    initialValue?.ctaButtons?.length ? initialValue.ctaButtons : [{ label: "Apply Now", whatsappNumber: "919000000000", whatsappMessage: "" }]
  );

  const [coverMediaId, setCoverMediaId] = useState(initialValue?.coverMediaId ?? "");
  const [uploading, setUploading] = useState(false);

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
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6">
        <Card>
          <CardContent className="grid gap-5 pt-6">
            {initialValue?.id && <input type="hidden" name="id" value={initialValue.id} />}
            <input type="hidden" name="coverMediaId" value={coverMediaId} />
            <input type="hidden" name="ctaButtons" value={JSON.stringify(ctaButtons)} />
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Course Title</label>
              <Input name="title" value={title} onChange={handleTitleChange} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Slug (URL)</label>
              <Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Short Description (Excerpt)</label>
              <Textarea name="excerpt" defaultValue={initialValue?.excerpt} rows={3} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Description</label>
              <Textarea name="bodyMarkdown" defaultValue={initialValue?.bodyMarkdown} rows={10} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-5 pt-6">
            <h3 className="font-bold">WhatsApp Action Buttons</h3>
            <p className="text-sm text-muted-foreground">Add buttons to direct users to specific WhatsApp numbers or messages (e.g. "For Men", "For Women").</p>
            
            {ctaButtons.map((btn, idx) => (
              <div key={idx} className="flex gap-2 items-start border p-3 rounded-md bg-muted/30">
                <div className="grid gap-3 flex-1">
                  <Input 
                    placeholder="Button Label (e.g. Apply for Men)" 
                    value={btn.label}
                    onChange={(e) => {
                      const newBtns = [...ctaButtons];
                      newBtns[idx].label = e.target.value;
                      setCtaButtons(newBtns);
                    }}
                    required
                  />
                  <Input 
                    placeholder="WhatsApp Number (e.g. 919000000000)" 
                    value={btn.whatsappNumber}
                    onChange={(e) => {
                      const newBtns = [...ctaButtons];
                      newBtns[idx].whatsappNumber = e.target.value;
                      setCtaButtons(newBtns);
                    }}
                    required
                  />
                  <Textarea 
                    placeholder="Custom WhatsApp Message (e.g. Hello, I want to join the men's batch)" 
                    value={btn.whatsappMessage}
                    onChange={(e) => {
                      const newBtns = [...ctaButtons];
                      newBtns[idx].whatsappMessage = e.target.value;
                      setCtaButtons(newBtns);
                    }}
                    rows={2}
                    required
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => {
                  setCtaButtons(ctaButtons.filter((_, i) => i !== idx));
                }}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={() => setCtaButtons([...ctaButtons, { label: "", whatsappNumber: "", whatsappMessage: "" }])}>
              <Plus className="mr-2 size-4" /> Add Button
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 items-start">
        <Card>
          <CardContent className="grid gap-5 pt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Course"}
            </Button>

            {state.status !== "idle" && (
              <div className={`rounded-md border p-3 text-sm ${state.status === "success" ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
                <p>{state.message}</p>
                {state.path && <Link href={state.path} className="mt-2 inline-block font-bold text-primary">View Course</Link>}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="grid gap-5 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Status</label>
              <select name="status" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" defaultValue={initialValue?.status ?? "draft"}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Cover Image</label>
              <div className="flex gap-2 items-center">
                <Button type="button" variant="secondary" className="w-full relative" disabled={uploading}>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileUpload} />
                  <Upload className="mr-2 size-4" /> {uploading ? "Uploading..." : coverMediaId ? "Image Selected" : "Upload Image"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Duration</label>
              <Input name="duration" defaultValue={initialValue?.duration} placeholder="e.g. 6 Months" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Instructor</label>
              <Input name="instructor" defaultValue={initialValue?.instructor} placeholder="e.g. Mueenuddeen Baqavi" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Eligibility</label>
              <Input name="eligibility" defaultValue={initialValue?.eligibility} placeholder="e.g. SSLC Passed" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Topics (comma separated)</label>
              <Input name="topics" defaultValue={initialValue?.topics} placeholder="e.g. Fiqh, Aqeedah, Seerah" />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
