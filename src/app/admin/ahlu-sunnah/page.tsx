import { deleteAhluSunnahAction } from "@/app/admin/_actions/content-actions";
import { ContentFilterBar } from "@/components/admin/content-filter-bar";
import { ContentListTable } from "@/components/admin/content-list-table";
import { PageHero } from "@/components/sections/page-hero";
import { listAdminAhluSunnah, type AdminContentStatus } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Manage Ahlu-Sunnah", path: "/admin/ahlu-sunnah" });

function parseStatus(status?: string): AdminContentStatus | "all" {
  return status === "draft" || status === "published" ? status : "all";
}

export default async function AdminAhluSunnahPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = parseStatus(status);
  const rows = await listAdminAhluSunnah(activeStatus);

  return (
    <>
      <PageHero title="Manage Ahlu-Sunnah" description="Drafts, scheduled posts, published content, SEO scores, views, edit entry points, and soft-delete workflow." />
      <section className="container grid gap-6 py-10">
        <ContentFilterBar basePath="/admin/ahlu-sunnah" createPath="/admin/ahlu-sunnah/new" activeStatus={activeStatus} />
        <ContentListTable rows={rows} basePath="/admin/ahlu-sunnah" publicBasePath="/ahlu-sunnah" deleteAction={deleteAhluSunnahAction} />
      </section>
    </>
  );
}
