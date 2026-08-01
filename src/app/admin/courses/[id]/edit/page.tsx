import { notFound } from "next/navigation";
import { updateCourseAction } from "@/app/admin/_actions/content-actions";
import { CourseEditorForm } from "@/components/admin/course-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { getAdminCourseForEdit } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Edit Course", path: "/admin/courses/edit" });

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getAdminCourseForEdit(id);

  if (!course) notFound();

  return (
    <>
      <PageHero title="Edit Course" description="Update course details and configure WhatsApp registration options." />
      <section className="container py-10">
        <CourseEditorForm action={updateCourseAction} initialValue={course} />
      </section>
    </>
  );
}
