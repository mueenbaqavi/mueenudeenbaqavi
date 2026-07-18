import { Badge } from "@/components/ui/badge";
import type { AdminContentStatus } from "@/lib/admin-content-repository";

const statusStyles: Record<AdminContentStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-accent/15 text-accent",
  published: "bg-secondary text-secondary-foreground",
  archived: "bg-destructive/10 text-destructive",
};

export function ContentStatusBadge({ status }: { status: AdminContentStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
