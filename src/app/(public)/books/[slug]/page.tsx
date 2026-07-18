import Image from "next/image";
import { Download, Eye, ShoppingBag } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { ShareActions } from "@/components/content/share-actions";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { books } from "@/data/content";
import { getBookBySlug } from "@/lib/content";
import { createMetadata } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  return createMetadata({
    title: book.title,
    description: book.description,
    path: `/books/${book.slug}`,
    image: book.cover,
  });
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  const url = absoluteUrl(`/books/${book.slug}`);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Books", path: "/books" }, { name: book.title, path: `/books/${book.slug}` }]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Book", name: book.title, description: book.description, image: absoluteUrl(book.cover), inLanguage: "ml" }} />
      <section className="container grid gap-10 py-12 lg:grid-cols-[360px_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-secondary shadow-[var(--shadow-card)]">
          <Image src={book.cover} alt="" fill className="object-cover" priority sizes="360px" />
        </div>
        <div className="max-w-3xl">
          <Badge>{book.category}</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{book.title}</h1>
          <p className="mt-5 text-xl leading-9 text-muted-foreground">{book.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge>{book.pages} pages</Badge>
            <Badge className="bg-accent/15 text-accent">{book.status}</Badge>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button variant="outline"><Eye className="size-4" />Preview PDF</Button>
            <Button><Download className="size-4" />Download</Button>
            <Button variant="accent"><ShoppingBag className="size-4" />Purchase</Button>
          </div>
          <div className="mt-8">
            <ShareActions title={book.title} url={url} />
          </div>
        </div>
      </section>
    </>
  );
}
