import { ContentCard } from "@/components/sections/content-card";
import { PageHero } from "@/components/sections/page-hero";
import { listPublishedAhluSunnahArticles } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "അഹ്‌ലുസ്സുന്ന", path: "/ahlu-sunnah" });

export default async function AhluSunnahPage() {
  const articles = await listPublishedAhluSunnahArticles();

  return (
    <>
      <PageHero title="അഹ്‌ലുസ്സുന്ന" description="സ്വതന്ത്ര വിഭാഗം, സ്വതന്ത്ര categories/admin, article-module feature set എന്നിവയോടെ." />
      <section className="container grid gap-6 py-12 md:grid-cols-3">
        {articles.map((item) => <ContentCard key={item.id} item={item} href={`/ahlu-sunnah/${item.slug}`} />)}
      </section>
    </>
  );
}
