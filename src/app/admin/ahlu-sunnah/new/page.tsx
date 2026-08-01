import { createMetadata } from "@/lib/site";
import { PageHero } from "@/components/sections/page-hero";
import { AhluSunnahEditorForm } from "@/components/admin/ahlu-sunnah-editor-form";

export const metadata = createMetadata({ title: "New Ahlu-Sunnah Entry", path: "/admin/ahlu-sunnah/new" });

export default function NewAhluSunnahPage() {
  return (
    <>
      <PageHero title="New Ahlu-Sunnah Entry" description="Create a new Ahlu-Sunnah entry." />
      <section className="container py-8">
        <AhluSunnahEditorForm />
      </section>
    </>
  );
}
