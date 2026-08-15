import Link from "next/link";
import { ArrowRight, BookMarked, GraduationCap, Landmark, MessageCircle, PlayCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContentCard } from "@/components/sections/content-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { ReadMoreText } from "@/components/home/read-more-text";
import { siteConfig } from "@/lib/site";
import { scholar } from "@/lib/constants";
import { listPublishedArticles, listPublishedFatwas, listPublishedBooks, listPublishedCourses, listClassSubjects } from "@/lib/content-repository";

export default async function Home() {
  const [articles, fatwas, classSubjects, courses, books] = await Promise.all([
    listPublishedArticles(),
    listPublishedFatwas(),
    listClassSubjects(),
    listPublishedCourses(),
    listPublishedBooks(),
  ]);
  const recentArticles = articles.slice(0, 3);
  const recentFatwas = fatwas.slice(0, 3);
  const recentBooks = books.slice(0, 3);
  const recentClassSubjects = classSubjects.slice(0, 3);
  const recentCourses = courses.slice(0, 3);

  return (
    <>
      <section className="border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="bg-accent/15 text-accent">Malayalam Islamic Knowledge Platform</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{scholar.name}</h1>
            <ReadMoreText text={scholar.summary} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/fatwas">
                <Button size="lg"><Search className="size-4" />ഫത്‌വകൾ</Button>
              </Link>
              <Link href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. എനിക്ക്  ഒരു വിഷയത്തിൻ്റെ  മതവിധി അറിയാൻ താല്പര്യമുണ്ടായിരുന്നു. ചോദിക്കട്ടയോ?")}`}>
                <Button size="lg" variant="outline"><MessageCircle className="size-4" />മതവിധി ചോദിക്കാം</Button>
              </Link>
            </div>
          </div>
          <div className="relative rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-accent" />
            <div className="grid gap-4">
              {[
                ["Articles", "പഠനയോഗ്യമായ വിശകലനങ്ങൾ", BookMarked],
                ["Fatwas", "സൂക്ഷ്മമായ മതപരമായ മറുപടികൾ", Landmark],
                ["Classes", "YouTube പ്ലേലിസ്റ്റ് അടിസ്ഥാന പഠനം", PlayCircle],
                ["Courses", "ഘടനാപരമായ ഓൺലൈൻ പഠനം", GraduationCap],
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
        <SectionHeading title="Biography" description={scholar.biography} />
        <div className="mt-8 flex items-center justify-center">
          <Link href="/biography">
            <Button size="lg" className="rounded-full px-8 text-base">
              കൂടുതൽ വായിക്കുക <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading title="Articles" description="വായന, ഗവേഷണം, പങ്കുവെക്കൽ എന്നിവയ്ക്കായി സജ്ജമാക്കിയ പുതിയ ഉള്ളടക്കങ്ങൾ." />
            <Link href="/articles" className="inline-flex items-center gap-2 font-bold text-primary">എല്ലാം കാണുക <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {recentArticles.length > 0 ? recentArticles.map((item) => <ContentCard key={item.id} item={item} href={`/articles/${item.slug}`} />) : <EmptyState />}
          </div>
        </div>
      </section>

      <section className="container grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <SectionHeading title="New Fatwas" description="ചോദ്യവും മറുപടിയും, വിഭാഗം, ടാഗുകൾ, PDF, പ്രിന്റ്, ഷെയർ സൗകര്യങ്ങളോടെ." />
          <div className="mt-6 grid gap-4">
            {recentFatwas.length > 0 ? recentFatwas.map((fatwa) => (
              <Link href={`/fatwas/${fatwa.slug}`} key={fatwa.number} className="block group h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <Badge className="border border-primary/20 bg-transparent text-primary font-mono">{fatwa.number}</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">{fatwa.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                      {fatwa.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="leading-relaxed text-muted-foreground line-clamp-3 flex-grow">
                      {fatwa.excerpt || fatwa.question}
                    </p>
                    <div className="mt-4 text-sm font-bold text-primary flex items-center gap-1 group-hover:underline underline-offset-4">
                      .....read more
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : <EmptyState />}
          </div>
        </div>
        <div className="flex flex-col gap-12">
          <div>
            <div className="flex items-center justify-between">
              <SectionHeading title="Classes" description="YouTube പ്ലേലിസ്റ്റ് അടിസ്ഥാന പഠനം" />
              <Link href="/classes" className="inline-flex shrink-0 items-center gap-1 font-bold text-primary hover:underline underline-offset-4">എല്ലാം <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-6 grid gap-4">
              {recentClassSubjects.length === 0 && <EmptyState />}
              {recentClassSubjects.map((item) => (
                <Link key={item.slug} href={`/classes/${item.slug}`} className="block group">
                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                    <CardContent className="pt-5">
                      <h3 className="font-bold group-hover:text-primary transition-colors">{item.subject}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{item.classes} Classes</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <SectionHeading title="Courses" description="ഘടനാപരമായ ഓൺലൈൻ പഠനം" />
              <Link href="/courses" className="inline-flex shrink-0 items-center gap-1 font-bold text-primary hover:underline underline-offset-4">എല്ലാം <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-6 grid gap-4">
              {recentCourses.length === 0 && <EmptyState />}
              {recentCourses.map((course) => (
                <Link key={course.slug} href={`/courses/${course.slug}`} className="block group">
                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                    <CardContent className="pt-5">
                      <h3 className="font-bold group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{course.duration} · {course.eligibility}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeading title="Books" description="കവർ, വിവരണം, PDF preview, വാങ്ങൽ, ഡൗൺലോഡ് സൗകര്യങ്ങൾക്കുള്ള ഘടന." />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {recentBooks.length > 0 ? recentBooks.map((book) => (
            <Card key={book.title}><CardContent className="pt-5"><Badge>{book.category}</Badge><h3 className="mt-3 text-xl font-bold">{book.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{book.description}</p></CardContent></Card>
          )) : <EmptyState />}
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
