import { Download, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "ജീവചരിത്രം",
  path: "/biography",
  description: "മുഹീനുദ്ദീൻ ബാഖവിയുടെ വിദ്യാഭ്യാസം, അധ്യാപകർ, സേവനങ്ങൾ, ഗ്രന്ഥങ്ങൾ, സ്ഥാനങ്ങൾ, ബന്ധപ്പെടൽ വിവരങ്ങൾ.",
});

const timeline = ["പ്രാഥമിക മതപഠനം", "ദർസ് പഠനം", "ബാഖവി പഠനം", "പ്രഭാഷണ സേവനങ്ങൾ", "ഗ്രന്ഥരചനയും ഡിജിറ്റൽ സംരക്ഷണവും"];

export default function BiographyPage() {
  return (
    <>
      <PageHero title="ജീവചരിത്രം" description="പണ്ഡിതന്റെ ജീവിതം, പഠനം, ഗുരുക്കന്മാർ, സേവനങ്ങൾ, കൃതികൾ, പൊതുപ്രവർത്തനം എന്നിവയുടെ ക്രമബദ്ധമായ രേഖ." />
      <section className="container grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><CardContent className="pt-5"><div className="aspect-[4/5] rounded-lg bg-secondary" /><h2 className="mt-5 text-2xl font-bold">മുഹീനുദ്ദീൻ ബാഖവി</h2><p className="mt-2 leading-8 text-muted-foreground">ഇസ്ലാമിക പണ്ഡിതൻ, പ്രഭാഷകൻ, എഴുത്തുകാരൻ</p><Button className="mt-5 w-full"><Download className="size-4" />Biography PDF</Button></CardContent></Card>
        <div className="prose-platform">
          <SectionHeading title="പ്രൊഫഷണൽ പ്രൊഫൈൽ" description="അറിവ്, ആദബ്, ആത്മീയ വളർച്ച, അഹ്‌ലുസ്സുന്നയുടെ പാരമ്പര്യബോധം എന്നിവ മലയാളി സമൂഹത്തിലേക്ക് എത്തിക്കുന്ന സേവനങ്ങൾക്ക് സമർപ്പിതമായ ജീവിതരേഖ." />
          <h2>വിദ്യാഭ്യാസവും അധ്യാപകരും</h2>
          <p>അഡ്മിൻ പാനലിൽ നിന്ന് വിദ്യാഭ്യാസം, അധ്യാപകർ, ഉയർന്ന പഠനം, സേവനങ്ങൾ, അവാർഡുകൾ, സ്ഥാനങ്ങൾ എന്നിവ ഘടനാപരമായി കൈകാര്യം ചെയ്യാം.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {["Education", "Teachers", "Higher Studies", "Services", "Awards", "Books", "Positions", "Gallery"].map((item) => <Card key={item}><CardContent className="pt-5 font-bold">{item}</CardContent></Card>)}
          </div>
        </div>
      </section>
      <section className="bg-muted/40 py-14">
        <div className="container">
          <SectionHeading title="ടൈംലൈൻ" description="ജീവിതവും സേവനങ്ങളും വർഷാനുക്രമമായി പ്രദർശിപ്പിക്കാൻ തയ്യാറാക്കിയ ഘടന." />
          <div className="mt-8 grid gap-4">
            {timeline.map((item, index) => <Card key={item}><CardContent className="flex gap-4 pt-5"><span className="font-mono text-accent">{String(index + 1).padStart(2, "0")}</span><span className="font-bold">{item}</span></CardContent></Card>)}
          </div>
        </div>
      </section>
      <section className="container grid gap-4 py-14 md:grid-cols-2">
        <Card><CardContent className="flex items-center gap-3 pt-5"><MapPin className="size-5 text-primary" />Kerala, India</CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 pt-5"><Mail className="size-5 text-primary" />info@mueenudeenbaqavi.com</CardContent></Card>
      </section>
    </>
  );
}
