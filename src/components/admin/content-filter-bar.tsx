import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminContentStatus } from "@/lib/admin-content-repository";

const statuses: (AdminContentStatus | "all")[] = ["all", "draft", "scheduled", "published", "archived"];

export function ContentFilterBar({
  basePath,
  createPath,
  activeStatus,
}: {
  basePath: string;
  createPath: string;
  activeStatus: AdminContentStatus | "all";
}) {
  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_auto]">
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search by title, slug, category" />
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Link key={status} href={status === "all" ? basePath : `${basePath}?status=${status}`}>
            <Button size="sm" variant={status === activeStatus ? "default" : "outline"}>{status}</Button>
          </Link>
        ))}
        <Link href={createPath}>
          <Button size="sm" variant="accent"><Plus className="size-4" />New</Button>
        </Link>
      </div>
    </div>
  );
}
