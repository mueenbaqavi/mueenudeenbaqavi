import { createCourseAction } from "@/app/admin/_actions/content-actions";
import { CourseEditorForm } from "@/components/admin/course-editor-form";
import { PageHero } from "@/components/sections/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "New Course", path: "/admin/courses/new" });

export default function NewCoursePage() {
  return (
    <>
      <PageHero title="New Course" description="Add a new course and configure WhatsApp registration options." />
      <section className="container py-10">
        <CourseEditorForm action={createCourseAction} />
      </section>
    </>
  );
}
