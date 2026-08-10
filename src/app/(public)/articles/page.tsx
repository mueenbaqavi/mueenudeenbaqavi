import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { ContentCard } from "@/components/sections/content-card";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedArticles } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Articles", path: "/articles", type: "website" });

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allArticles = await listPublishedArticles();
  
  // Extract unique categories from articles
  const uniqueCategories = Array.from(new Set(allArticles.map(a => a.category))).filter(Boolean);

  // Filter articles if a category is selected
  const articles = category 
    ? allArticles.filter(a => a.category === category)
    : allArticles;

  return (
    <>
      <PageHero title="Articles" description="Featured layout, filters, categories, reading time, views, share, bookmark, pagination എന്നിവയ്ക്കായി തയ്യാറാക്കിയ ലേഖന വിഭാഗം." />
      <section className="container py-12">
        <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_auto]">
          <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="ലേഖനങ്ങൾ തിരയുക" /></div>
          <Button variant="outline"><Filter className="size-4" />Latest</Button>
        </div>
        
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/articles">
            <Badge className={!category ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}>
              All
            </Badge>
          </Link>
          {uniqueCategories.map((c) => (
            <Link key={c} href={`/articles?category=${encodeURIComponent(c)}`}>
              <Badge className={category === c ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}>
                {c}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.length > 0 ? articles.map((item) => <ContentCard key={item.id} item={item} href={`/articles/${item.slug}`} />) : <EmptyState />}
        </div>
      </section>
    </>
  );
}
