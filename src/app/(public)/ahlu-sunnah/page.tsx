import { ContentCard } from "@/components/sections/content-card";
import { PageHero } from "@/components/sections/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedAhluSunnahArticles } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "അഹ്‌ലുസ്സുന്ന", path: "/ahlu-sunnah" });

export default async function AhluSunnahPage() {
  const articles = await listPublishedAhluSunnahArticles();

  return (
    <>
      <PageHero title="അഹ്‌ലുസ്സുന്ന" description="വിശുദ്ധ ഖുർആനും തിരുസുന്നത്തും സച്ചരിതരായ മുൻഗാമികളുടെ (സലഫുസ്സ്വാലിഹീൻ) മാർഗ്ഗത്തിലൂടെ മനസ്സിലാക്കുകയും ജീവിതത്തിൽ പകർത്തുകയും ചെയ്യുന്ന അഹ്‌ലുസ്സുന്ന വൽ ജമാഅത്തിന്റെ ആശയവിശദീകരണങ്ങൾ." />
      <section className="container grid gap-6 py-12 md:grid-cols-3">
        {articles.length > 0 ? articles.map((item) => <ContentCard key={item.id} item={item} href={`/ahlu-sunnah/${item.slug}`} />) : <EmptyState />}
      </section>
    </>
  );
}
