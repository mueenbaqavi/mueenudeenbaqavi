import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, FileQuestion, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { RelatedList } from "@/components/content/related-list";
import { ShareActions } from "@/components/content/share-actions";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedFatwaBySlug, listPublishedFatwas } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";
import { absoluteUrl, formatMalayalamDate } from "@/lib/utils";

import { marked } from "marked";

type PageProps = {
  params: Promise<{ slug: string }>;
};



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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">{fatwa.category}</Badge>
              {fatwa.tags?.map((tag) => <Badge key={tag} className="bg-accent/15 text-accent">{tag}</Badge>)}
            </div>
            <Badge className="border border-primary/20 bg-transparent text-primary font-mono text-base px-3 py-1">{fatwa.number}</Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{fatwa.title}</h1>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatMalayalamDate(fatwa.date)}</span>
            <span className="flex items-center gap-2">മറുപടി നൽകിയത്: <strong className="text-foreground">{fatwa.givenBy?.join(", ")}</strong></span>
            <span className="flex items-center gap-2"><Eye className="size-4" />{fatwa.views}</span>
            <span>{fatwa.readTime}</span>
          </div>
        </div>
      </section>
      <article className="container max-w-4xl py-12">
        <div className="rounded-lg border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="flex items-center gap-2 font-bold mb-4"><FileQuestion className="size-5 text-primary" />ചോദ്യം</h2>
          <div className="prose-platform text-lg leading-9 text-muted-foreground" dangerouslySetInnerHTML={{ __html: marked.parse(fatwa.question, { breaks: true }) as string }} />
        </div>
        <div className="prose-platform mt-8 rounded-lg border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="flex items-center gap-2 mb-6"><MessageCircle className="size-6 text-primary" />മറുപടി</h2>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(fatwa.answer, { breaks: true }) as string }} />
          <p className="text-sm mt-8 pt-4 border-t border-border/50 text-muted-foreground">
            വ്യക്തിഗത സാഹചര്യങ്ങൾ വ്യത്യസ്തമായതിനാൽ പ്രായോഗിക തീരുമാനങ്ങൾക്ക് നേരിട്ട് പണ്ഡിത മാർഗ്ഗനിർദ്ദേശം തേടുന്നത് നല്ലതാണ്.
          </p>
        </div>
        
        {fatwa.references && fatwa.references.length > 0 && (
          <div className="mt-8 rounded-lg border bg-muted/30 p-6">
            <h3 className="font-bold mb-4 text-lg">അവലംബങ്ങൾ (References)</h3>
            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-muted-foreground">
              {fatwa.references.map((ref, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: marked.parseInline(ref) as string }} />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <ShareActions title={fatwa.title} url={url} downloadable={false} />
        </div>
        <RelatedList title="ബന്ധപ്പെട്ട ഫത്വകൾ" items={related} basePath="/fatwas" />
      </article>
      <Link className="fixed bottom-5 right-5 z-40" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. എനിക്ക് ഒരു ഫത്വ ചോദിക്കാനുണ്ട്.")}`}>
        <Button size="lg"><MessageCircle className="size-4" />Ask Fatwa</Button>
      </Link>
    </>
  );
}
