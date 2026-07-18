import Link from "next/link";
import { ArrowRight, BookMarked, GraduationCap, Landmark, MessageCircle, PlayCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContentCard } from "@/components/sections/content-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { articles, books, classSubjects, courses, fatwas, scholar } from "@/data/content";
import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="bg-accent/15 text-accent">Malayalam Islamic Knowledge Platform</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{scholar.name}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-10 text-muted-foreground">{scholar.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/fatwas">
                <Button size="lg"><Search className="size-4" />ഫത്വ തിരയുക</Button>
              </Link>
              <Link href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. ഒരു ഫത്വ ചോദിക്കാൻ ആഗ്രഹിക്കുന്നു.")}`}>
                <Button size="lg" variant="outline"><MessageCircle className="size-4" />ഫത്വ ചോദിക്കുക</Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-accent" />
            <div className="grid gap-4">
              {[
                ["ലേഖനങ്ങൾ", "പഠനയോഗ്യമായ വിശകലനങ്ങൾ", BookMarked],
                ["ഫത്വകൾ", "സൂക്ഷ്മമായ മതപരമായ മറുപടികൾ", Landmark],
                ["ക്ലാസുകൾ", "YouTube പ്ലേലിസ്റ്റ് അടിസ്ഥാന പഠനം", PlayCircle],
                ["കോഴ്സുകൾ", "ഘടനാപരമായ ഓൺലൈൻ പഠനം", GraduationCap],
              ].map(([title, text, Icon]) => (
                <div key={title as string} className="flex gap-4 rounded-lg border bg-background p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-bold">{title as string}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{text as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading title="ജീവചരിത്ര സംഗ്രഹം" description={scholar.biography} />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["വിദ്യാഭ്യാസം", "അധ്യാപകർ", "സേവനങ്ങൾ", "ഗ്രന്ഥങ്ങൾ"].map((item) => (
            <Card key={item}><CardContent className="pt-5 text-lg font-bold">{item}</CardContent></Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading title="പ്രധാന ലേഖനങ്ങൾ" description="വായന, ഗവേഷണം, പങ്കുവെക്കൽ എന്നിവയ്ക്കായി സജ്ജമാക്കിയ പുതിയ ഉള്ളടക്കങ്ങൾ." />
            <Link href="/articles" className="inline-flex items-center gap-2 font-bold text-primary">എല്ലാം കാണുക <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {articles.map((item) => <ContentCard key={item.id} item={item} href={`/articles/${item.slug}`} />)}
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <SectionHeading title="പുതിയ ഫത്വകൾ" description="ചോദ്യവും മറുപടിയും, വിഭാഗം, ടാഗുകൾ, PDF, പ്രിന്റ്, ഷെയർ സൗകര്യങ്ങളോടെ." />
          <div className="mt-6 grid gap-4">
            {fatwas.map((fatwa) => (
              <Card key={fatwa.number}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge>{fatwa.number}</Badge>
                    <span className="text-sm text-muted-foreground">{fatwa.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold">{fatwa.title}</h3>
                </CardHeader>
                <CardContent><p className="leading-8 text-muted-foreground">{fatwa.question}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading title="ക്ലാസുകളും കോഴ്സുകളും" description="വിഷയങ്ങൾ, പുരോഗതി, യോഗ്യത, അപേക്ഷ എന്നിവ അഡ്മിനിൽ നിന്ന് നിയന്ത്രിക്കാവുന്ന രീതിയിൽ." />
          <div className="mt-6 grid gap-4">
            {classSubjects.map((item) => (
              <Card key={item.subject}><CardContent className="pt-5"><h3 className="font-bold">{item.subject}</h3><p className="mt-2 text-sm text-muted-foreground">{item.classes} ക്ലാസുകൾ · {item.progress}% പൂർത്തിയായി</p></CardContent></Card>
            ))}
            {courses.map((course) => (
              <Card key={course.title}><CardContent className="pt-5"><h3 className="font-bold">{course.title}</h3><p className="mt-2 text-sm text-muted-foreground">{course.duration} · {course.eligibility}</p></CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading title="പുസ്തകങ്ങൾ" description="കവർ, വിവരണം, PDF preview, വാങ്ങൽ, ഡൗൺലോഡ് സൗകര്യങ്ങൾക്കുള്ള ഘടന." />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {books.map((book) => (
            <Card key={book.title}><CardContent className="pt-5"><Badge>{book.category}</Badge><h3 className="mt-3 text-xl font-bold">{book.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{book.description}</p></CardContent></Card>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-bold">അറിവ് സംരക്ഷിക്കുന്ന വിശ്വസനീയ ഡിജിറ്റൽ വേദി</h2>
            <p className="mt-3 max-w-3xl leading-8 text-primary-foreground/80">
              ജീവചരിത്രം, പുസ്തകങ്ങൾ, അഹ്‌ലുസ്സുന്ന ഉള്ളടക്കങ്ങൾ, ഗാലറി, ബന്ധപ്പെടൽ, SEO, അഡ്മിൻ പ്രവർത്തനങ്ങൾ എല്ലാം ഒരേ സംവിധാനത്തിൽ.
            </p>
          </div>
          <Link href="/contact"><Button variant="accent" size="lg">ബന്ധപ്പെടുക</Button></Link>
        </div>
      </section>
    </>
  );
}
