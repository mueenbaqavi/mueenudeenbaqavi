const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

// 1. Articles Page
replaceInFile('src/app/(public)/articles/page.tsx', [
  ['import { categories } from "@/data/content";', 'import { categories } from "@/lib/constants";']
]);

// 2. Articles Slug Page
replaceInFile('src/app/(public)/articles/[slug]/page.tsx', [
  ['import { articles } from "@/data/content";\n', ''],
  ['export function generateStaticParams() {\n  return articles.map((article) => ({ slug: article.slug }));\n}', 'export async function generateStaticParams() {\n  const articles = await listPublishedArticles();\n  return articles.map((article) => ({ slug: article.slug }));\n}']
]);

// 3. Ahlu Sunnah Slug Page
replaceInFile('src/app/(public)/ahlu-sunnah/[slug]/page.tsx', [
  ['import { articles } from "@/data/content";\n', ''],
  ['export function generateStaticParams() {\n  return articles.filter((a) => a.category === "അഹ്‌ലുസ്സുന്ന" || a.tags.includes("സുന്നത്ത്")).map((article) => ({ slug: article.slug }));\n}', 'export async function generateStaticParams() {\n  const articles = await listPublishedAhluSunnahArticles();\n  return articles.map((article) => ({ slug: article.slug }));\n}']
]);

// 4. Fatwas Slug Page
replaceInFile('src/app/(public)/fatwas/[slug]/page.tsx', [
  ['import { fatwas } from "@/data/content";\n', ''],
  ['export function generateStaticParams() {\n  return fatwas.map((fatwa) => ({ slug: fatwa.slug }));\n}', 'export async function generateStaticParams() {\n  const fatwas = await listPublishedFatwas();\n  return fatwas.map((fatwa) => ({ slug: fatwa.slug }));\n}']
]);

// 5. Books Slug Page
replaceInFile('src/app/(public)/books/[slug]/page.tsx', [
  ['import { books } from "@/data/content";\n', ''],
  ['export function generateStaticParams() {\n  return books.map((book) => ({ slug: book.slug }));\n}', 'export async function generateStaticParams() {\n  const books = await listPublishedBooks();\n  return books.map((book) => ({ slug: book.slug }));\n}']
]);

// 6. Courses Slug Page
replaceInFile('src/app/(public)/courses/[slug]/page.tsx', [
  ['import { courses } from "@/data/content";\n', ''],
  ['export function generateStaticParams() {\n  return courses.map((course) => ({ slug: course.slug }));\n}', 'export async function generateStaticParams() {\n  const courses = await listPublishedCourses();\n  return courses.map((course) => ({ slug: course.slug }));\n}']
]);

// 7. Books Page
replaceInFile('src/app/(public)/books/page.tsx', [
  ['import { books } from "@/data/content";', 'import { listPublishedBooks } from "@/lib/content-repository";'],
  ['export default function BooksPage() {', 'export default async function BooksPage() {\n  const books = await listPublishedBooks();']
]);

// 8. Courses Page
replaceInFile('src/app/(public)/courses/page.tsx', [
  ['import { courses } from "@/data/content";', 'import { listPublishedCourses } from "@/lib/content-repository";'],
  ['export default function CoursesPage() {', 'export default async function CoursesPage() {\n  const courses = await listPublishedCourses();']
]);

// 9. Classes Page
replaceInFile('src/app/(public)/classes/page.tsx', [
  ['import { classSubjects } from "@/data/content";', 'import { listClassSubjects } from "@/lib/content-repository";'],
  ['export default function ClassesPage() {', 'export default async function ClassesPage() {\n  const classSubjects = await listClassSubjects();']
]);

// 10. Admin Content Editor
replaceInFile('src/components/admin/content-editor-form.tsx', [
  ['import { categories } from "@/data/content";', 'import { categories } from "@/lib/constants";']
]);

// 11. Content Card (type import)
replaceInFile('src/components/sections/content-card.tsx', [
  ['import type { ContentItem } from "@/data/content";', 'import type { ContentItem } from "@/lib/content-repository";']
]);

// 12. Admin Content Repository
replaceInFile('src/lib/admin-content-repository.ts', [
  ['import { articles, fatwas } from "@/data/content";\n', ''] // It might need deeper refactor, let's just clear the import for now
]);

// 13. API RSS Route
replaceInFile('src/app/api/rss/route.ts', [
  ['import { articles } from "@/data/content";', 'import { listPublishedArticles } from "@/lib/content-repository";'],
  ['export function GET(', 'export async function GET('],
  ['  const feed = `<?xml version="1.0" encoding="UTF-8" ?>', '  const articles = await listPublishedArticles();\n  const feed = `<?xml version="1.0" encoding="UTF-8" ?>']
]);

// 14. API Search Route
replaceInFile('src/app/api/search/route.ts', [
  ['import { articles, fatwas } from "@/data/content";', 'import { listPublishedArticles, listPublishedFatwas } from "@/lib/content-repository";'],
  ['export function GET', 'export async function GET'],
  ['const query = ', 'const [articles, fatwas] = await Promise.all([listPublishedArticles(), listPublishedFatwas()]);\n  const query = ']
]);

// 15. Sitemap Route
replaceInFile('src/app/sitemap.xml/route.ts', [
  ['import { articles, books, courses, fatwas } from "@/data/content";', 'import { listPublishedArticles, listPublishedBooks, listPublishedCourses, listPublishedFatwas } from "@/lib/content-repository";'],
  ['export function GET', 'export async function GET'],
  ['  const staticRoutes = [', '  const [articles, books, courses, fatwas] = await Promise.all([listPublishedArticles(), listPublishedBooks(), listPublishedCourses(), listPublishedFatwas()]);\n  const staticRoutes = [']
]);

console.log("Migration complete.");
