import { createMetadata } from "@/lib/site";
import { PageHero } from "@/components/sections/page-hero";
import { BookEditorForm } from "@/components/admin/book-editor-form";

export const metadata = createMetadata({ title: "New Book", path: "/admin/books/new" });

export default function NewBookPage() {
  return (
    <>
      <PageHero title="New Book" description="Create a new book entry." />
      <section className="container py-8">
        <BookEditorForm />
      </section>
    </>
  );
}
