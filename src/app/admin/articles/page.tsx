import { softDeleteArticleAction } from "@/app/admin/_actions/content-actions";
import { ContentFilterBar } from "@/components/admin/content-filter-bar";
import { ContentListTable } from "@/components/admin/content-list-table";
import { PageHero } from "@/components/sections/page-hero";
import { listAdminArticles, type AdminContentStatus } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Manage Articles", path: "/admin/articles" });

function parseStatus(status?: string): AdminContentStatus | "all" {
  return status === "draft" || status === "scheduled" || status === "published" || status === "archived" ? status : "all";
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = parseStatus(status);
  const rows = await listAdminArticles(activeStatus);

  return (
    <>
      <PageHero title="Manage Articles" description="Drafts, scheduled posts, published articles, SEO scores, views, edit entry points, and soft-delete workflow." />
      <section className="container grid gap-6 py-10">
        <ContentFilterBar basePath="/admin/articles" createPath="/admin/articles/new" activeStatus={activeStatus} />
        <ContentListTable rows={rows} basePath="/admin/articles" publicBasePath="/articles" deleteAction={softDeleteArticleAction} />
      </section>
    </>
  );
}
