import { createArticleAction } from "@/app/admin/_actions/content-actions";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { createMetadata } from "@/lib/site";
import { listCategories, listAuthors } from "@/lib/admin-content-repository";

export const metadata = createMetadata({ title: "New Article", path: "/admin/articles/new" });

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    listCategories("article"),
    listAuthors(),
  ]);

  return (
    <>
      <PageHero title="New Article" description="Rich text, markdown, auto slug, autosave, preview, SEO score, draft and scheduling workflow." />
      <section className="container py-10">
        <ContentEditorForm action={createArticleAction} kind="article" categories={categories} authors={authors} />
      </section>
    </>
  );
}
