import { notFound } from "next/navigation";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { updateArticleAction } from "@/app/admin/_actions/content-actions";
import { getAdminArticleForEdit } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Edit Article", path: "/admin/articles/edit" });

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getAdminArticleForEdit(id);
  if (!article) notFound();

  return (
    <>
      <PageHero title="Edit Article" description={`Update ${article.title}, sync taxonomy, and write a revision snapshot before saving.`} />
      <section className="container py-10">
        <ContentEditorForm action={updateArticleAction} initialValue={article} kind="article" />
      </section>
    </>
  );
}
