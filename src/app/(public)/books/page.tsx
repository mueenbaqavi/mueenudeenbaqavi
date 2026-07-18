import Link from "next/link";
import { Download, Eye, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/data/content";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "പുസ്തകങ്ങൾ", path: "/books" });

export default function BooksPage() {
  return (
    <>
      <PageHero title="പുസ്തകങ്ങൾ" description="Book cover, description, preview PDF, purchase link, download link, category എന്നിവ." />
      <section className="container grid gap-6 py-12 md:grid-cols-2">
        {books.map((book) => <Card key={book.title}><CardContent className="grid gap-5 pt-5 sm:grid-cols-[150px_1fr]"><div className="aspect-[3/4] rounded-lg bg-secondary" /><div><Badge>{book.category}</Badge><h2 className="mt-3 text-2xl font-bold"><Link href={`/books/${book.slug}`}>{book.title}</Link></h2><p className="mt-2 leading-8 text-muted-foreground">{book.description}</p><div className="mt-5 flex flex-wrap gap-2"><Button size="sm" variant="outline"><Eye className="size-4" />Preview</Button><Button size="sm"><Download className="size-4" />Download</Button><Button size="sm" variant="accent"><ShoppingBag className="size-4" />Purchase</Button></div></div></CardContent></Card>)}
      </section>
    </>
  );
}
