import { FileArchive, FileText, Folder, ImageIcon, Music, Search, Upload } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Media Library", path: "/admin/media" });

const assets = [
  { name: "Article covers", type: "Folder", icon: Folder },
  { name: "Biography portrait", type: "Image", icon: ImageIcon },
  { name: "Book preview PDF", type: "PDF", icon: FileText },
  { name: "Audio lectures", type: "Audio", icon: Music },
  { name: "Downloads", type: "Documents", icon: FileArchive },
];

export default function MediaLibraryPage() {
  return (
    <>
      <PageHero title="Media Library" description="Folders, images, PDF, audio, documents, search, metadata, alt text and Supabase Storage organization." />
      <section className="container py-10">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="Search media" /></div>
          <Button><Upload className="size-4" />Upload</Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {assets.map((asset) => <Card key={asset.name}><CardContent className="pt-5"><asset.icon className="size-7 text-primary" /><h2 className="mt-4 font-bold">{asset.name}</h2><p className="text-sm text-muted-foreground">{asset.type}</p></CardContent></Card>)}
        </div>
      </section>
    </>
  );
}
