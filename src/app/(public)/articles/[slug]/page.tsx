import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, UserRound } from "lucide-react";
import { marked } from "marked";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { RelatedList } from "@/components/content/related-list";
import { ShareActions } from "@/components/content/share-actions";
import { Badge } from "@/components/ui/badge";
import { getPublishedArticleBySlug, listPublishedArticles } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";
import { absoluteUrl, formatMalayalamDate } from "@/lib/utils";
import { JsonLd } from "@/components/site/json-ld";

type PageProps = {
  params: Promise<{ slug: string }>;
};



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
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          datePublished: article.date,
          mainEntityOfPage: url,
        }}
      />
      
      {/* Hide the main footer via CSS since this page has a custom one */}
      <style dangerouslySetInnerHTML={{ __html: `
        footer.bg-secondary { display: none !important; }
      `}} />

      <article className="container py-12 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl text-foreground">{article.title}</h1>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-base text-muted-foreground">
            <span className="flex items-center gap-2 font-bold text-foreground">
              <UserRound className="size-5" />{article.author}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2"><CalendarDays className="size-4" />{formatMalayalamDate(article.date)}</span>
              <span className="flex items-center gap-2">• {article.readTime}</span>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{article.category}</Badge>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <ShareActions title={article.title} url={url} />
          </div>
        </div>

        <div className="prose-platform mx-auto mt-16 max-w-3xl text-lg leading-loose text-foreground/90">
          {article.arabicQuote ? (
            <blockquote dir="rtl" className="arabic-quote rounded-lg border bg-muted p-5 text-3xl text-primary mb-8">
              {article.arabicQuote}
            </blockquote>
          ) : null}
          
          <div 
            className="space-y-6"
            dangerouslySetInnerHTML={{ __html: marked.parse(article.body, { breaks: true }) as string }} 
          />
        </div>

        {related.length > 0 ? (
          <div className="mx-auto mt-24 max-w-5xl border-t pt-16">
            <RelatedList title="ബന്ധപ്പെട്ട ലേഖനങ്ങൾ" items={related} basePath="/articles" />
          </div>
        ) : null}
      </article>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </footer>
    </>
  );
}
