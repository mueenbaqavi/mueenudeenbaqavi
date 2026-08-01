import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "scheduled", "published", "archived"]);

export const articleEditorSchema = z.object({
  title: z.string().min(4, "Title is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug can only contain English letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt is too short"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  bodyMarkdown: z.string().min(10, "Article content is too short"),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const fatwaEditorSchema = z.object({
  fatwaNumber: z.string().min(3, "Fatwa number is required"),
  title: z.string().min(4, "Title is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug can only contain English letters, numbers, and hyphens"),
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
