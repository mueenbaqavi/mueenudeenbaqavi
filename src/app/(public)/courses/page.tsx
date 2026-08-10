import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedCourses } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "Courses", path: "/courses" });

export default async function CoursesPage() {
  const courses = await listPublishedCourses();
  return (
    <>
      <PageHero title="Courses" description="Course image, duration, topics, instructor, eligibility, WhatsApp apply എന്നിവയ്ക്ക് തയ്യാറായ പഠന ഘടന." />
      <section className="container grid gap-6 py-12 md:grid-cols-2">
        {courses.length > 0 ? courses.map((course) => (
          <Card key={course.title}>
            <CardContent className="pt-5">
              <div className="aspect-video rounded-lg bg-secondary relative overflow-hidden flex items-center justify-center">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
                ) : (
                  <img src="/images/book-cover.svg" alt={course.title} className="w-full h-full object-contain opacity-10" />
                )}
              </div>
              <h2 className="mt-5 text-2xl font-bold">
                <Link href={`/courses/${course.slug}`}>{course.title}</Link>
              </h2>
              <p className="mt-2 text-muted-foreground">{course.duration} · {course.eligibility}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.topics.map((topic) => <Badge key={topic}>{topic}</Badge>)}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {course.ctaButtons && course.ctaButtons.length > 0 ? (
                  course.ctaButtons.map((btn, i) => (
                    <Link key={i} href={`https://wa.me/${btn.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(btn.whatsappMessage)}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <MessageCircle className="size-4 mr-2" />{btn.label}
                      </Button>
                    </Link>
                  ))
                ) : (
                  <Link href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`അസ്സലാമു അലൈക്കും. ${course.title} കോഴ്സിലേക്ക് അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നു.`)}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="size-4 mr-2" />Apply Now
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )) : <EmptyState />}
      </section>
    </>
  );
}
