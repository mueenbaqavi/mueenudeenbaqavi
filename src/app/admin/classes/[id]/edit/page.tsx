import { notFound } from "next/navigation";
import { editClassSubjectAction } from "@/app/admin/_actions/content-actions";
import { ClassEditorForm } from "@/components/admin/class-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { getAdminClassSubjectForEdit } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Edit Class", path: "/admin/classes/edit" });

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cls = await getAdminClassSubjectForEdit(id);

  if (!cls) {
    notFound();
  }

  return (
    <>
      <PageHero title="Edit Class" description="Update details for the YouTube playlist class." />
      <section className="container max-w-3xl py-10">
        <ClassEditorForm action={editClassSubjectAction} initialValue={cls} />
      </section>
    </>
  );
}
