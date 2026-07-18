import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/content";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "കോഴ്സുകൾ", path: "/courses" });

export default function CoursesPage() {
  return (
    <>
      <PageHero title="കോഴ്സുകൾ" description="Course image, duration, topics, instructor, eligibility, WhatsApp apply എന്നിവയ്ക്ക് തയ്യാറായ പഠന ഘടന." />
      <section className="container grid gap-6 py-12 md:grid-cols-2">
        {courses.map((course) => <Card key={course.title}><CardContent className="pt-5"><div className="aspect-video rounded-lg bg-secondary" /><h2 className="mt-5 text-2xl font-bold"><Link href={`/courses/${course.slug}`}>{course.title}</Link></h2><p className="mt-2 text-muted-foreground">{course.duration} · {course.eligibility}</p><div className="mt-4 flex flex-wrap gap-2">{course.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}</div><Link href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`അസ്സലാമു അലൈക്കും. ${course.title} കോഴ്സിലേക്ക് അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നു.`)}`}><Button className="mt-5"><MessageCircle className="size-4" />Apply</Button></Link></CardContent></Card>)}
      </section>
    </>
  );
}
