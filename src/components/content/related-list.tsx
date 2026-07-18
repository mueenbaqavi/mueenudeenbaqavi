import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RelatedList({ title, items, basePath }: { title: string; items: { title: string; slug: string; excerpt?: string; question?: string }[]; basePath: string }) {
  if (items.length === 0) return null;

  return (
    <aside className="mt-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug}>
            <CardContent className="pt-5">
              <h3 className="font-bold leading-snug">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.excerpt ?? item.question}</p>
              <Link href={`${basePath}/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                വായിക്കുക <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  );
}
