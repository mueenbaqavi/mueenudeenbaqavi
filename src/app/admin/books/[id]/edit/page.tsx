import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/site";
import { getAdminBookForEdit } from "@/lib/admin-content-repository";
import { PageHero } from "@/components/sections/page-hero";
import { BookEditorForm } from "@/components/admin/book-editor-form";

export const metadata = createMetadata({ title: "Edit Book", path: "/admin/books/[id]/edit" });

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const data = await getAdminBookForEdit(params.id);

  if (!data) {
    notFound();
  }

  return (
    <>
      <PageHero title="Edit Book" description="Update existing book entry." />
      <section className="container py-8">
        <BookEditorForm initialValue={data} />
      </section>
    </>
  );
}
