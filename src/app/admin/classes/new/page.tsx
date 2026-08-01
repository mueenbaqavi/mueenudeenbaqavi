import { createClassSubjectAction } from "@/app/admin/_actions/content-actions";
import { ClassEditorForm } from "@/components/admin/class-editor-form";
import { PageHero } from "@/components/sections/page-hero";

export default function NewClassPage() {
  return (
    <>
      <PageHero title="New Class" description="Add a YouTube playlist to display a class." />
      <section className="container max-w-3xl py-10">
        <ClassEditorForm action={createClassSubjectAction} />
      </section>
    </>
  );
}
