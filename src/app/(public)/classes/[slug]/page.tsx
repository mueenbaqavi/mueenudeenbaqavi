import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { getClassSubjectBySlug } from "@/lib/content-repository";
import { createMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = await getClassSubjectBySlug(slug);
  if (!subject) return {};
  return createMetadata({ title: subject.subject, path: `/classes/${slug}`, type: "article" });
}

export default async function ClassSubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = await getClassSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  return (
    <>
      <PageHero 
        title={subject.subject} 
        description={subject.description || "വിവിധ വിഷയങ്ങളിലുള്ള പഠന ക്ലാസുകൾ"} 
      />
      <section className="container py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/30 p-4 rounded-lg border">
            <div>
              <h3 className="font-bold text-lg">ക്ലാസുകളുടെ പ്ലേലിസ്റ്റ്</h3>
              <p className="text-sm text-muted-foreground mt-1">
                മറ്റ് ക്ലാസുകൾ തിരഞ്ഞെടുക്കാൻ വീഡിയോ പ്ലെയറിന്റെ മുകളിൽ വലതുവശത്തുള്ള <strong>പ്ലേലിസ്റ്റ് ഐക്കൺ (≡)</strong> ക്ലിക്ക് ചെയ്യുക.
              </p>
            </div>
            {subject.youtubePlaylistId && (
              <a 
                href={`https://youtube.com/playlist?list=${subject.youtubePlaylistId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shrink-0"
              >
                YouTube-ൽ പ്ലേലിസ്റ്റ് കാണുക
              </a>
            )}
          </div>

          <div className="rounded-xl overflow-hidden shadow-xl bg-black aspect-video relative">
            {!subject.youtubePlaylistId ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Playlist URL not provided
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${subject.youtubePlaylistId}`}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={subject.subject}
              ></iframe>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
