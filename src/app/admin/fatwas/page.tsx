import { softDeleteFatwaAction } from "@/app/admin/_actions/content-actions";
import { ContentFilterBar } from "@/components/admin/content-filter-bar";
import { ContentListTable } from "@/components/admin/content-list-table";
import { PageHero } from "@/components/sections/page-hero";
import { listAdminFatwas, type AdminContentStatus } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Manage Fatwas", path: "/admin/fatwas" });

function parseStatus(status?: string): AdminContentStatus | "all" {
  return status === "draft" || status === "scheduled" || status === "published" || status === "archived" ? status : "all";
}

export default async function AdminFatwasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = parseStatus(status);
  const rows = await listAdminFatwas(activeStatus);

  return (
    <>
      <PageHero title="Manage Fatwas" description="Fatwa number, status, category, views, SEO score, edit entry points, and soft-delete workflow." />
      <section className="container grid gap-6 py-10">
        <ContentFilterBar basePath="/admin/fatwas" createPath="/admin/fatwas/new" activeStatus={activeStatus} />
        <ContentListTable rows={rows} basePath="/admin/fatwas" publicBasePath="/fatwas" deleteAction={softDeleteFatwaAction} />
      </section>
    </>
  );
}
