import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/45">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <h2 className="text-xl font-bold">{siteConfig.name}</h2>
          <p className="mt-3 max-w-xl leading-8 text-muted-foreground">{siteConfig.description}</p>
        </div>
        <div>
          <h3 className="font-bold">വിഭാഗങ്ങൾ</h3>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <Link href="/articles">ലേഖനങ്ങൾ</Link>
            <Link href="/fatwas">ഫത്വകൾ</Link>
            <Link href="/ahlu-sunnah">അഹ്‌ലുസ്സുന്ന</Link>
            <Link href="/admin">അഡ്മിൻ</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">ബന്ധപ്പെടുക</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="size-4" />{siteConfig.address}</span>
            <span className="flex items-center gap-2"><Phone className="size-4" />{siteConfig.phone}</span>
            <span className="flex items-center gap-2"><Mail className="size-4" />{siteConfig.email}</span>
            <span className="flex items-center gap-2"><MessageCircle className="size-4" />WhatsApp: {siteConfig.phone}</span>
          </div>
        </div>
      </div>
      <div className="border-t py-5 text-center text-sm text-muted-foreground">
        © 2026 {siteConfig.scholarName}. All rights reserved.
      </div>
    </footer>
  );
}
