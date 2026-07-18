import Image from "next/image";
import Link from "next/link";
import { Bookmark, CalendarDays, Eye, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentItem } from "@/data/content";
import { formatMalayalamDate } from "@/lib/utils";

export function ContentCard({ item, href }: { item: ContentItem; href: string }) {
  return (
    <Card className="overflow-hidden">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] bg-secondary">
          <Image src={item.image} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
        </div>
      </Link>
      <CardContent className="pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.category}</Badge>
          <span className="text-xs text-muted-foreground">{item.readTime}</span>
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug">
          <Link href={href}>{item.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 leading-7 text-muted-foreground">{item.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{formatMalayalamDate(item.date)}</span>
          <span className="flex items-center gap-1"><Eye className="size-3.5" />{item.views}</span>
          <span className="flex items-center gap-2">
            <Bookmark className="size-4" />
            <Share2 className="size-4" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
