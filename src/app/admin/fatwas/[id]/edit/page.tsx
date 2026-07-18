import { notFound } from "next/navigation";
import { updateFatwaAction } from "@/app/admin/_actions/content-actions";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { getAdminFatwaForEdit } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Edit Fatwa", path: "/admin/fatwas/edit" });

export default async function EditFatwaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fatwa = await getAdminFatwaForEdit(id);
  if (!fatwa) notFound();

  return (
    <>
      <PageHero title="Edit Fatwa" description={`Update ${fatwa.fatwaNumber}, sync taxonomy, and write a revision snapshot before saving.`} />
      <section className="container py-10">
        <ContentEditorForm action={updateFatwaAction} initialValue={fatwa} kind="fatwa" />
      </section>
    </>
  );
}
