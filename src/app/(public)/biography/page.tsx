import Image from "next/image";
import Link from "next/link";
import { Award, BookOpen, CalendarDays, Download, GraduationCap, Mail, MapPin, Phone, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "ജീവചരിത്രം",
  path: "/biography",
  description:
    "മുഈനുദ്ദീൻ ബാഖവി പിയുടെ ജനനം, കുടുംബം, മതപഠനം, ഉപരിപഠനം, സേവനം, ഗ്രന്ഥങ്ങൾ, പദവികൾ, ബന്ധപ്പെടൽ വിവരങ്ങൾ.",
  image: "/mueenusta.jpeg",
});

const books = [
  "രോഗ പരിചരണം മയ്യിത്ത് പരിപാലനം",
  "അനന്തരാവകാശം, ഒരു എളുപ്പ വായന",
  "യാത്രയിലെ മര്യാദകൾ",
  "ഹജ്ജ് - ഉംറ - അദ്കാർ ഹാൻഡ് ബുക്ക്",
  "ആനുകാലിക വിഷയങ്ങളിലെ കർമശാസ്ത്ര ലേഖനങ്ങൾ",
];

const religiousStudies = [
  "ശൈഖുനാ മർഹും മഞ്ചേരി U പുല്ലൂർ അബ്ദുറഹീം ബാഖവി",
  "പി.എ. ബിരാൻ കുട്ടി ബാഖവി",
];

const higherStudies = [
  "വെല്ലൂർ ബാഖിയാതുസ്സ്വാലിഹാത്തിൽ നിന്ന് 2000ൽ മുത്വവ്വൽ ഒന്നാം റാങ്കോടെ ബാഖവി MFB ബിരുദം",
  "മഞ്ചേരി ദാറുസ്സുന്ന ഇസ്ലാമിക കേന്ദ്രത്തിൽ നിന്ന് ഇസ്ലാമിക ദഅവയിൽ ബിരുദാനന്തര ബിരുദം (MD)",
];

const services = [
  "ശംസുൽ ഉലമ ഇസ്ലാമിക് അക്കാദമി, വെങ്ങപ്പള്ളി",
  "വാഫി ക്യാമ്പസ് പ്രൊഫസർ, കാളികാവ്",
  "ജനറൽ സെക്രട്ടറി, ബസ്മല എജുക്കേഷൻ ആൻഡ് ചാരിറ്റബിൾ ട്രസ്റ്റ്, നെല്ലിക്കാട് വിളയിൽ",
];

const positions = [
  "Founder, Annoor Online Shareea Academy",
  "Director, Annoor Online Madrasa",
  "English Malayalam academic initiatives",
];

export default function BiographyPage() {
  return (
    <>
      <PageHero
        title="ജീവചരിത്രം"
        description="ദർസ് രംഗത്ത് മികവുറ്റ പണ്ഡിതൻ, അധ്യാപകൻ, ഗ്രന്ഥകാരൻ എന്നീ നിലകളിൽ സേവനം അനുഷ്ഠിക്കുന്ന മുഈനുദ്ദീൻ ബാഖവി പിയുടെ ഔദ്യോഗിക ജീവിതരേഖ."
      />

      <section className="container grid gap-10 py-14 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-5">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/5] bg-secondary">
              <Image
                src="/mueenusta.jpeg"
                alt="മുഈനുദ്ദീൻ ബാഖവി പി"
                fill
                priority
                className="object-contain p-3"
                sizes="(min-width: 1024px) 360px, 100vw"
              />
            </div>
            <CardContent className="pt-5">
              <Badge className="bg-accent/15 text-accent">Islamic Scholar</Badge>
              <h2 className="mt-4 text-2xl font-bold">മുഈനുദ്ദീൻ ബാഖവി പി</h2>
              <p className="mt-2 leading-8 text-muted-foreground">ഇസ്ലാമിക പണ്ഡിതൻ, അധ്യാപകൻ, ഗ്രന്ഥകാരൻ</p>
              <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />ജനനം: മേയ് 1977</span>
                <span className="flex items-center gap-2"><Phone className="size-4 text-primary" />{siteConfig.phone}</span>
                <span className="flex items-center gap-2"><Mail className="size-4 text-primary" />{siteConfig.email}</span>
              </div>
              <Link href="/downloads/mueenuddeen-baqavi-cv.pdf" download className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                <Download className="size-4" />
                Biography PDF
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <h3 className="flex items-center gap-2 font-bold"><MapPin className="size-5 text-primary" />വിലാസം</h3>
              <address className="mt-3 not-italic leading-8 text-muted-foreground">
                മുഈനുദ്ദീൻ ബാഖവി പി<br />
                പുൽപ്പറമ്പൻ ഹൗസ്<br />
                പി.ഒ. വിളയിൽ<br />
                കുഴിമണ്ണ, മലപ്പുറം<br />
                673641
              </address>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-10">
          <section className="prose-platform">
            <SectionHeading
              title="പണ്ഡിത ജീവിതരേഖ"
              description="ദർസ് അധ്യാപനം, ഗ്രന്ഥരചന, കർമശാസ്ത്ര പഠനങ്ങൾ, വിദ്യാഭ്യാസ സേവനം എന്നിവയിൽ ശ്രദ്ധേയമായ സേവനം അനുഷ്ഠിച്ചുവരുന്ന പണ്ഡിതനാണ് മുഈനുദ്ദീൻ ബാഖവി പി. 2018ൽ മികച്ച വാഫി അധ്യാപകനുള്ള അവാർഡ് ലഭിച്ചു."
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">പിതാവ്</p><p className="mt-1 font-bold">കുഞ്ഞുമുട്ടി ഹാജി</p></CardContent></Card>
              <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">മാതാവ്</p><p className="mt-1 font-bold">താച്ചുട്ടി</p></CardContent></Card>
              <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">സഹധർമ്മിണി</p><p className="mt-1 font-bold">ഉമ്മു സൽമ തൗഫീഖിയ്യ</p></CardContent></Card>
              <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">അഭിരുചി</p><p className="mt-1 font-bold">ഇസ്ലാമിക വിജ്ഞാനീയങ്ങൾ, കർമശാസ്ത്ര പഠനങ്ങൾ</p></CardContent></Card>
            </div>
          </section>

          <section>
            <SectionHeading title="മതപഠനം" description="പ്രധാന ഗുരുനാഥന്മാരിൽ നിന്ന് ദർസ് പഠനവും പാരമ്പര്യ മതവിജ്ഞാന പഠനവും നേടി." />
            <div className="mt-5 grid gap-3">
              {religiousStudies.map((item) => (
                <Card key={item}><CardContent className="flex items-center gap-3 pt-5"><Users className="size-5 text-primary" /><span className="font-semibold">{item}</span></CardContent></Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="ഉപരിപഠനം" description="ഉയർന്ന മതപഠന സ്ഥാപനങ്ങളിൽ നിന്ന് റാങ്കോടെയും ബിരുദാനന്തര യോഗ്യതയോടെയും പഠനം പൂർത്തിയാക്കി." />
            <div className="mt-5 grid gap-3">
              {higherStudies.map((item) => (
                <Card key={item}><CardContent className="flex items-start gap-3 pt-5"><GraduationCap className="mt-1 size-5 shrink-0 text-primary" /><span className="leading-8 font-semibold">{item}</span></CardContent></Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="ഗ്രന്ഥങ്ങൾ" description="കർമശാസ്ത്രം, യാത്ര, ഹജ്ജ്-ഉംറ, മയ്യിത്ത് പരിപാലനം തുടങ്ങിയ പ്രായോഗിക വിഷയങ്ങളിൽ രചിച്ച ഗ്രന്ഥങ്ങൾ." />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {books.map((book) => (
                <Card key={book}><CardContent className="flex items-start gap-3 pt-5"><BookOpen className="mt-1 size-5 shrink-0 text-primary" /><span className="leading-8 font-semibold">{book}</span></CardContent></Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="സേവനം" description="അധ്യാപനം, അക്കാദമിക് പ്രവർത്തനം, വിദ്യാഭ്യാസ-ചാരിറ്റബിൾ പ്രവർത്തനങ്ങൾ എന്നിവയിൽ സേവനം." />
            <div className="mt-5 grid gap-3">
              {services.map((item) => (
                <Card key={item}><CardContent className="flex items-start gap-3 pt-5"><Award className="mt-1 size-5 shrink-0 text-primary" /><span className="leading-8 font-semibold">{item}</span></CardContent></Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading title="വഹിക്കുന്ന പദവികൾ" description="ഓൺലൈൻ ശരീഅ അക്കാദമി, ഓൺലൈൻ മദ്റസ, ഇംഗ്ലീഷ്-മലയാളം വിദ്യാഭ്യാസ പ്രവർത്തനങ്ങൾ." />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {positions.map((item) => (
                <Card key={item}><CardContent className="pt-5 font-bold leading-8">{item}</CardContent></Card>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
