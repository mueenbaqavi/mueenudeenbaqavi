import { PlayCircle, Search } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { classSubjects } from "@/data/content";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "ക്ലാസുകൾ", path: "/classes" });

export default function ClassesPage() {
  return (
    <>
      <PageHero title="ക്ലാസുകൾ" description="വിഷയപ്രകാരം YouTube playlists, embedded player, class count, progress, search എന്നിവ." />
      <section className="container py-12">
        <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="വിഷയം തിരയുക" /></div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {classSubjects.map((item) => <Card key={item.subject}><CardContent className="pt-5"><div className="grid aspect-video place-items-center rounded-lg bg-secondary"><PlayCircle className="size-12 text-primary" /></div><h2 className="mt-5 text-xl font-bold">{item.subject}</h2><p className="mt-2 text-sm text-muted-foreground">{item.classes} classes · {item.progress}% progress</p><Button className="mt-5 w-full" variant="outline">Open in YouTube</Button></CardContent></Card>)}
        </div>
      </section>
    </>
  );
}
