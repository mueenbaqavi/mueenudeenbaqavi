import { Filter, Search } from "lucide-react";
import { ContentCard } from "@/components/sections/content-card";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/content";
import { listPublishedArticles } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "ലേഖനങ്ങൾ", path: "/articles", type: "website" });

export default async function ArticlesPage() {
  const articles = await listPublishedArticles();

  return (
    <>
      <PageHero title="ലേഖനങ്ങൾ" description="Featured layout, filters, categories, reading time, views, share, bookmark, pagination എന്നിവയ്ക്കായി തയ്യാറാക്കിയ ലേഖന വിഭാഗം." />
      <section className="container py-12">
        <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_auto]">
          <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="ലേഖനങ്ങൾ തിരയുക" /></div>
          <Button variant="outline"><Filter className="size-4" />Latest</Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{categories.map((category) => <Badge key={category}>{category}</Badge>)}</div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.map((item) => <ContentCard key={item.id} item={item} href={`/articles/${item.slug}`} />)}
        </div>
      </section>
    </>
  );
}
