import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listClassSubjects } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Classes", path: "/classes", type: "website" });

export default async function ClassesPage() {
  const subjects = await listClassSubjects();

  return (
    <>
      <PageHero title="Classes" description="വിവിധ വിഷയങ്ങളിലുള്ള പഠന ക്ലാസുകൾ ഇവിടെ ലഭ്യമാണ്." />
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {subjects.length === 0 ? (
            <div className="col-span-full">
              <EmptyState />
            </div>
          ) : (
            subjects.map((subject) => (
              <Link key={subject.slug} href={`/classes/${subject.slug}`} className="block group h-full">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                        <PlayCircle className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">
                          {subject.subject}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {subject.classes} Classes
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {subject.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {subject.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
