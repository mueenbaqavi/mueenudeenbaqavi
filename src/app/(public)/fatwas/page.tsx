import Link from "next/link";
import { Copy, Download, MessageCircle, Printer, Search, Share2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedFatwas } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "ഫത്‌വകൾ", path: "/fatwas" });

export default async function FatwasPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allFatwas = await listPublishedFatwas();
  
  const uniqueCategories = Array.from(new Set(allFatwas.map(f => f.category))).filter(Boolean);
  const fatwas = category ? allFatwas.filter(f => f.category === category) : allFatwas;

  return (
    <>
      <PageHero title="ഫത്‌വകൾ" description="ചോദ്യം, മറുപടി, നമ്പർ, വിഭാഗം, ടാഗുകൾ, തീയതി, അറ്റാച്ച്മെന്റ്, PDF, പ്രിന്റ്, related fatwas എന്നിവയോടെ." />
      <section className="container py-12">
        <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="ഫത്‌വ നമ്പർ, വിഷയം, വിഭാഗം തിരയുക" /></div>
        
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/fatwas">
            <Badge className={!category ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}>
              All
            </Badge>
          </Link>
          {uniqueCategories.map((c) => (
            <Link key={c} href={`/fatwas?category=${encodeURIComponent(c)}`}>
              <Badge className={category === c ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}>
                {c}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5">
          {fatwas.length > 0 ? fatwas.map((fatwa: any) => (
            <Card key={fatwa.number} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">{fatwa.category}</Badge>
                    {fatwa.tags?.map((tag: string) => <Badge key={tag} className="bg-accent/15 text-accent">{tag}</Badge>)}
                  </div>
                  <Badge className="border border-primary/20 bg-transparent text-primary font-mono">{fatwa.number}</Badge>
                </div>
                <h2 className="text-2xl font-bold leading-snug">
                  <Link href={`/fatwas/${fatwa.slug}`} className="hover:text-primary transition-colors">{fatwa.title}</Link>
                </h2>
                {fatwa.excerpt && (
                  <p className="text-muted-foreground mt-2 leading-relaxed">{fatwa.excerpt}</p>
                )}
              </CardHeader>
              <CardContent>
                <Link href={`/fatwas/${fatwa.slug}`} className={buttonVariants({ size: "sm", className: "mt-2" })}>
                  Read More
                </Link>
              </CardContent>
            </Card>
          )) : <EmptyState />}
        </div>
      </section>
      <Link className="fixed bottom-5 right-5 z-40" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. എനിക്ക്  ഒരു വിഷയത്തിൻ്റെ  മതവിധി അറിയാൻ താല്പര്യമുണ്ടായിരുന്നു. ചോദിക്കട്ടയോ?")}`}><Button size="lg"><MessageCircle className="size-4" />Ask Fatwa</Button></Link>
    </>
  );
}
