import { Badge } from "@/components/ui/badge";
import type { AdminContentStatus } from "@/lib/admin-content-repository";

const statusStyles: Record<AdminContentStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-secondary text-secondary-foreground",
};

export function ContentStatusBadge({ status }: { status: AdminContentStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
