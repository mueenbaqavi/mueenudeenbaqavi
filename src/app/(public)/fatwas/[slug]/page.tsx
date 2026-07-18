import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, FileQuestion, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { RelatedList } from "@/components/content/related-list";
import { ShareActions } from "@/components/content/share-actions";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fatwas } from "@/data/content";
import { getPublishedFatwaBySlug, listPublishedFatwas } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";
import { absoluteUrl, formatMalayalamDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fatwas.map((fatwa) => ({ slug: fatwa.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const fatwa = await getPublishedFatwaBySlug(slug);
  if (!fatwa) return createMetadata({ title: "Fatwa", path: `/fatwas/${slug}` });

  return createMetadata({
    title: fatwa.title,
    description: fatwa.question,
    path: `/fatwas/${fatwa.slug}`,
    type: "article",
  });
}

export default async function FatwaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fatwa = await getPublishedFatwaBySlug(slug);
  if (!fatwa) notFound();

  const url = absoluteUrl(`/fatwas/${fatwa.slug}`);
  const related = (await listPublishedFatwas()).filter((item) => item.slug !== fatwa.slug && item.category === fatwa.category).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Fatwas", path: "/fatwas" },
          { name: fatwa.title, path: `/fatwas/${fatwa.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [{
            "@type": "Question",
            name: fatwa.question,
            acceptedAnswer: { "@type": "Answer", text: fatwa.answer },
          }],
        }}
      />
      <section className="border-b bg-muted/40 py-12">
        <div className="container max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <Badge>{fatwa.number}</Badge>
            <Badge>{fatwa.category}</Badge>
            {fatwa.tags.map((tag) => <Badge key={tag} className="bg-accent/15 text-accent">{tag}</Badge>)}
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{fatwa.title}</h1>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatMalayalamDate(fatwa.date)}</span>
            <span className="flex items-center gap-2"><Eye className="size-4" />{fatwa.views}</span>
            <span>{fatwa.readTime}</span>
          </div>
        </div>
      </section>
      <article className="container max-w-4xl py-12">
        <div className="rounded-lg border bg-card p-6 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 font-bold"><FileQuestion className="size-5 text-primary" />ചോദ്യം</p>
          <p className="mt-3 text-lg leading-9 text-muted-foreground">{fatwa.question}</p>
        </div>
        <div className="prose-platform mt-8 rounded-lg border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2>മറുപടി</h2>
          <p>{fatwa.answer}</p>
          <p>വ്യക്തിഗത സാഹചര്യങ്ങൾ വ്യത്യസ്തമായതിനാൽ പ്രായോഗിക തീരുമാനങ്ങൾക്ക് നേരിട്ട് പണ്ഡിത മാർഗ്ഗനിർദ്ദേശം തേടുന്നത് നല്ലതാണ്.</p>
        </div>
        <div className="mt-8">
          <ShareActions title={fatwa.title} url={url} downloadable />
        </div>
        <RelatedList title="ബന്ധപ്പെട്ട ഫത്വകൾ" items={related} basePath="/fatwas" />
      </article>
      <Link className="fixed bottom-5 right-5 z-40" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. എനിക്ക് ഒരു ഫത്വ ചോദിക്കാനുണ്ട്.")}`}>
        <Button size="lg"><MessageCircle className="size-4" />Ask Fatwa</Button>
      </Link>
    </>
  );
}
