import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle, UserRound } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/content/breadcrumb-json-ld";
import { JsonLd } from "@/components/site/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedCourseBySlug, listPublishedCourses } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};



export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);
  if (!course) return createMetadata({ title: "Course Not Found" });

  return createMetadata({
    title: course.title,
    description: course.description,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);
  if (!course) notFound();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Courses", path: "/courses" }, { name: course.title, path: `/courses/${course.slug}` }]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Course", name: course.title, description: course.description, inLanguage: "ml", provider: { "@type": "Person", name: course.instructor } }} />
      <section className="border-b bg-muted/40 py-12">
        <div className="container max-w-4xl">
          <Badge>Course</Badge>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">{course.title}</h1>
          {course.image && (
            <div className="mt-8 aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
              <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
            </div>
          )}
          <p className="mt-5 text-xl leading-9 text-muted-foreground">{course.description}</p>
        </div>
      </section>
      <section className="container grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-bold">പാഠ്യവിഷയങ്ങൾ</h2>
          <div className="mt-5 grid gap-3">
            {course.topics.map((topic) => (
              <Card key={topic}>
                <CardContent className="flex items-center gap-3 pt-5">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="font-bold">{topic}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="grid gap-4 pt-5">
            <div className="flex items-center gap-3"><Clock className="size-5 text-primary" /><span>{course.duration}</span></div>
            <div className="flex items-center gap-3"><UserRound className="size-5 text-primary" /><span>{course.instructor}</span></div>
            <p className="leading-7 text-muted-foreground">Eligibility: {course.eligibility}</p>
            <div className="mt-4 flex flex-col gap-3">
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
                  <Button className="w-full bg-green-600 hover:bg-green-700"><MessageCircle className="size-4 mr-2" />Apply on WhatsApp</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
