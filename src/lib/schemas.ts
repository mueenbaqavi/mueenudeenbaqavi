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

export const ahluSunnahEditorSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().min(10, "Content must be at least 10 characters"),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
});

export const fatwaEditorSchema = z.object({
  fatwaNumber: z.string().optional(),
  title: z.string().min(4, "Title is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug can only contain English letters, numbers, and hyphens"),
  question: z.string().min(20),
  answer: z.string().min(40),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
  givenBy: z.array(z.string()).default([]),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type ArticleEditorInput = z.infer<typeof articleEditorSchema>;
export type FatwaEditorInput = z.infer<typeof fatwaEditorSchema>;

export const courseEditorSchema = z.object({
  title: z.string().min(4, "Title is required"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug can only contain English letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  duration: z.string().optional(),
  instructor: z.string().optional(),
  eligibility: z.string().optional(),
  topics: z.array(z.string()).default([]),
  ctaButtons: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    whatsappNumber: z.string().min(1, "Number is required"),
    whatsappMessage: z.string().min(1, "Message is required"),
  })).default([]),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
});
export type CourseEditorInput = z.infer<typeof courseEditorSchema>;

export const bookEditorSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/, "Slug can only contain English letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author is required"),
  downloadLink: z.string().optional(),
  status: contentStatusSchema.default("draft"),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});
export type BookEditorInput = z.infer<typeof bookEditorSchema>;
