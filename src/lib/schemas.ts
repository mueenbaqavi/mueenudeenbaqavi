import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "scheduled", "published", "archived"]);

export const articleEditorSchema = z.object({
  title: z.string().min(4, "Title is required"),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(20),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  bodyMarkdown: z.string().min(40),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const fatwaEditorSchema = z.object({
  fatwaNumber: z.string().min(3),
  title: z.string().min(4),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  question: z.string().min(20),
  answer: z.string().min(40),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type ArticleEditorInput = z.infer<typeof articleEditorSchema>;
export type FatwaEditorInput = z.infer<typeof fatwaEditorSchema>;
