import { createFatwaAction } from "@/app/admin/_actions/content-actions";
import { ContentEditorForm } from "@/components/admin/content-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "New Fatwa", path: "/admin/fatwas/new" });

export default function NewFatwaPage() {
  return (
    <>
      <PageHero title="New Fatwa" description="Fatwa number, Malayalam question and answer, tags, attachments, PDF, print, related content and SEO workflow." />
      <section className="container py-10">
        <ContentEditorForm action={createFatwaAction} kind="fatwa" />
      </section>
    </>
  );
}
