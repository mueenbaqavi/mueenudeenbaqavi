import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Eye } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { RelatedList } from "@/components/content/related-list";
import { ShareActions } from "@/components/content/share-actions";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/content";
import { getPublishedArticleBySlug, listPublishedAhluSunnahArticles } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";
import { absoluteUrl, formatMalayalamDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ahluSunnahArticles = articles.filter((item) => item.category === "അഹ്‌ലുസ്സുന്ന" || item.tags.includes("സുന്നത്ത്"));

export function generateStaticParams() {
  return ahluSunnahArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return createMetadata({ title: "Ahlu Sunnah", path: `/ahlu-sunnah/${slug}` });

  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/ahlu-sunnah/${article.slug}`,
    type: "article",
    image: article.image,
  });
}

export default async function AhluSunnahDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const url = absoluteUrl(`/ahlu-sunnah/${article.slug}`);
  const related = (await listPublishedAhluSunnahArticles()).filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Ahlu Sunnah", path: "/ahlu-sunnah" }, { name: article.title, path: `/ahlu-sunnah/${article.slug}` }]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.excerpt, image: absoluteUrl(article.image), author: { "@type": "Person", name: article.author }, publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url }, datePublished: article.date, mainEntityOfPage: url }} />
      <article className="container py-12">
        <div className="mx-auto max-w-4xl">
          <Badge>അഹ്‌ലുസ്സുന്ന</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-9 text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatMalayalamDate(article.date)}</span>
            <span className="flex items-center gap-2"><Eye className="size-4" />{article.views}</span>
            <span>{article.readTime}</span>
          </div>
          <div className="mt-8"><ShareActions title={article.title} url={url} /></div>
        </div>
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-lg border bg-secondary">
          <Image src={article.image} alt="" fill className="object-cover" priority sizes="(min-width: 1024px) 960px, 100vw" />
        </div>
        <div className="prose-platform mx-auto mt-10 max-w-3xl">
          {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mx-auto max-w-5xl">
          <RelatedList title="ബന്ധപ്പെട്ട ഉള്ളടക്കങ്ങൾ" items={related} basePath="/ahlu-sunnah" />
        </div>
      </article>
    </>
  );
}
