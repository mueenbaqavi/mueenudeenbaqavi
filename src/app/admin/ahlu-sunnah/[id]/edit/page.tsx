import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/site";
import { getAdminAhluSunnahForEdit } from "@/lib/admin-content-repository";
import { PageHero } from "@/components/sections/page-hero";
import { AhluSunnahEditorForm } from "@/components/admin/ahlu-sunnah-editor-form";

export const metadata = createMetadata({ title: "Edit Ahlu-Sunnah", path: "/admin/ahlu-sunnah/[id]/edit" });

export default async function EditAhluSunnahPage({ params }: { params: { id: string } }) {
  const data = await getAdminAhluSunnahForEdit(params.id);

  if (!data) {
    notFound();
  }

  return (
    <>
      <PageHero title="Edit Ahlu-Sunnah" description="Update existing Ahlu-Sunnah entry." />
      <section className="container py-8">
        <AhluSunnahEditorForm initialValue={data} />
      </section>
    </>
  );
}
