import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "ബന്ധപ്പെടുക", path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero title="ബന്ധപ്പെടുക" description="Address, WhatsApp, Email, Google Map, validated contact form എന്നിവയ്ക്കുള്ള പേജ്." />
      <section className="container grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          <Card><CardContent className="flex gap-3 pt-5"><MapPin className="size-5 text-primary" />{siteConfig.address}</CardContent></Card>
          <Card><CardContent className="flex gap-3 pt-5"><Phone className="size-5 text-primary" />{siteConfig.phone}</CardContent></Card>
          <Card><CardContent className="flex gap-3 pt-5"><MessageCircle className="size-5 text-primary" />WhatsApp: {siteConfig.phone}</CardContent></Card>
          <Card><CardContent className="flex gap-3 pt-5"><Mail className="size-5 text-primary" />{siteConfig.email}</CardContent></Card>
          <div className="grid aspect-video place-items-center rounded-lg border bg-muted text-muted-foreground">Google Map Embed</div>
        </div>
        <Card><CardContent className="grid gap-4 pt-5"><Input placeholder="പേര്" /><Input placeholder="ഇമെയിൽ" type="email" /><textarea className="min-h-40 rounded-md border bg-background p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="സന്ദേശം" /><Button><Send className="size-4" />അയയ്ക്കുക</Button></CardContent></Card>
      </section>
    </>
  );
}
