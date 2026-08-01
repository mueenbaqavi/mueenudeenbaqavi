import { deleteBookAction } from "@/app/admin/_actions/content-actions";
import { ContentFilterBar } from "@/components/admin/content-filter-bar";
import { ContentListTable } from "@/components/admin/content-list-table";
import { PageHero } from "@/components/sections/page-hero";
import { listAdminBooks, type AdminContentStatus } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Manage Books", path: "/admin/books" });

function parseStatus(status?: string): AdminContentStatus | "all" {
  return status === "draft" || status === "published" ? status : "all";
}

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = parseStatus(status);
  const rows = await listAdminBooks(activeStatus);

  return (
    <>
      <PageHero title="Manage Books" description="Drafts, published books, SEO scores, views, edit entry points, and soft-delete workflow." />
      <section className="container grid gap-6 py-10">
        <ContentFilterBar basePath="/admin/books" createPath="/admin/books/new" activeStatus={activeStatus} />
        <ContentListTable rows={rows} basePath="/admin/books" publicBasePath="/books" deleteAction={deleteBookAction} />
      </section>
    </>
  );
}
