import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { SoftDeleteButton } from "@/components/admin/soft-delete-button";
import { ContentStatusBadge } from "@/components/admin/content-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminContentRow } from "@/lib/admin-content-repository";
import { formatMalayalamDate } from "@/lib/utils";

export function ContentListTable({
  rows,
  basePath,
  publicBasePath,
  deleteAction,
}: {
  rows: AdminContentRow[];
  basePath: "/admin/articles" | "/admin/fatwas";
  publicBasePath: "/articles" | "/fatwas";
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid min-w-[920px] grid-cols-[1.5fr_120px_130px_120px_110px_220px] border-b bg-muted/40 px-5 py-3 text-sm font-bold text-muted-foreground">
          <span>Title</span>
          <span>Status</span>
          <span>Category</span>
          <span>Views</span>
          <span>SEO</span>
          <span>Actions</span>
        </div>
        <div className="overflow-x-auto">
          {rows.map((row) => (
            <div key={row.id} className="grid min-w-[920px] grid-cols-[1.5fr_120px_130px_120px_110px_220px] items-center border-b px-5 py-4 text-sm last:border-b-0">
              <div>
                <p className="font-bold leading-snug">{row.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {row.fatwaNumber ? `${row.fatwaNumber} · ` : null}
                  /{row.slug} · Updated {formatMalayalamDate(row.updatedAt)}
                </p>
              </div>
              <ContentStatusBadge status={row.status} />
              <span className="text-muted-foreground">{row.category}</span>
              <span className="font-mono text-muted-foreground">{row.views}</span>
              <span className="font-mono text-muted-foreground">{row.seoScore ?? "-"}/100</span>
              <div className="flex flex-wrap gap-2">
                <Link href={`${basePath}/${row.id}/edit`}>
                  <Button size="sm" variant="outline"><Pencil className="size-4" />Edit</Button>
                </Link>
                <Link href={`${publicBasePath}/${row.slug}`}>
                  <Button size="sm" variant="outline"><Eye className="size-4" />View</Button>
                </Link>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="slug" value={row.slug} />
                  <SoftDeleteButton />
                </form>
              </div>
            </div>
          ))}
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No content found for this filter.</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
