import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, UserRound } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { RelatedList } from "@/components/content/related-list";
import { ShareActions } from "@/components/content/share-actions";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/content";
import { getPublishedArticleBySlug, listPublishedArticles } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";
import { absoluteUrl, formatMalayalamDate } from "@/lib/utils";
import { JsonLd } from "@/components/site/json-ld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return createMetadata({ title: "Article", path: `/articles/${slug}` });

  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    type: "article",
    image: article.image,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const url = absoluteUrl(`/articles/${article.slug}`);
  const related = (await listPublishedArticles()).filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: absoluteUrl(article.image),
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          datePublished: article.date,
          mainEntityOfPage: url,
        }}
      />
      <article className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{article.category}</Badge>
            {article.tags.map((tag) => (
              <Badge key={tag} className="bg-accent/15 text-accent">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-9 text-muted-foreground">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><UserRound className="size-4" />{article.author}</span>
            <span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatMalayalamDate(article.date)}</span>
            <span className="flex items-center gap-2"><Eye className="size-4" />{article.views}</span>
            <span>{article.readTime}</span>
          </div>
          <div className="mt-8">
            <ShareActions title={article.title} url={url} />
          </div>
        </div>
        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-lg border bg-secondary">
          <Image src={article.image} alt="" fill className="object-cover" priority sizes="(min-width: 1024px) 960px, 100vw" />
        </div>
        <div className="prose-platform mx-auto mt-10 max-w-3xl">
          {article.arabicQuote ? (
            <blockquote dir="rtl" className="arabic-quote rounded-lg border bg-muted p-5 text-3xl text-primary">
              {article.arabicQuote}
            </blockquote>
          ) : null}
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mx-auto max-w-5xl">
          <RelatedList title="ബന്ധപ്പെട്ട ലേഖനങ്ങൾ" items={related} basePath="/articles" />
        </div>
      </article>
    </>
  );
}
