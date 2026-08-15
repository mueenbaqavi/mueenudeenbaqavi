import { Globe2, MessageCircle, Palette, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "Settings", path: "/admin/settings" });

export default function SettingsPage() {
  return (
    <>
      <PageHero title="Settings" description="Site identity, SEO defaults, menus, footer, WhatsApp, and theme configuration." />
      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><Globe2 className="size-5 text-primary" />Site Identity</h2><div className="space-y-2"><label className="text-sm text-muted-foreground">Site Name</label><Input defaultValue={siteConfig.name} /></div><div className="space-y-2"><label className="text-sm text-muted-foreground">Domain</label><Input defaultValue={siteConfig.domain} /></div><div className="space-y-2"><label className="text-sm text-muted-foreground">Contact Email</label><Input defaultValue={siteConfig.email} /></div></CardContent></Card>
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><MessageCircle className="size-5 text-primary" />WhatsApp Configuration</h2><div className="space-y-2"><label className="text-sm text-muted-foreground">WhatsApp Number</label><Input defaultValue={siteConfig.whatsapp} /></div><div className="space-y-2"><label className="text-sm text-muted-foreground">Default Message</label><Input defaultValue="അസ്സലാമു അലൈക്കും. എനിക്ക്  ഒരു വിഷയത്തിൻ്റെ  മതവിധി അറിയാൻ താല്പര്യമുണ്ടായിരുന്നു. ചോദിക്കട്ടയോ?" /></div></CardContent></Card>
        <div className="flex flex-col lg:col-span-2 items-end justify-end">
          <Button size="lg">Save Settings</Button>
        </div>
      </section>
    </>
  );
}
