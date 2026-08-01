"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentItem } from "@/lib/content-repository";
import { User, Clock } from "lucide-react";

export function ContentCard({ item, href }: { item: ContentItem; href: string }) {
  return (
    <Link href={href} className="block group h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
        <CardContent className="p-6 flex flex-col h-full">
          <h3 className="text-2xl font-bold leading-snug group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {item.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Clock className="size-3.5" />
              {item.readTime}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
            <User className="size-4" />
            {item.author}
          </div>

          <p className="mt-4 line-clamp-3 leading-loose text-muted-foreground flex-grow">
            {item.excerpt}
          </p>
          
          <div className="mt-4 text-sm font-bold text-primary flex items-center gap-1 group-hover:underline underline-offset-4">
            .....read more
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
