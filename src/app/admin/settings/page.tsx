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
      <PageHero title="Settings" description="Site identity, SEO defaults, menus, footer, WhatsApp, theme and security configuration." />
      <section className="container grid gap-6 py-10 lg:grid-cols-2">
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><Globe2 className="size-5 text-primary" />Site Identity</h2><Input defaultValue={siteConfig.name} /><Input defaultValue={siteConfig.domain} /><Input defaultValue={siteConfig.email} /></CardContent></Card>
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><MessageCircle className="size-5 text-primary" />WhatsApp</h2><Input defaultValue={siteConfig.whatsapp} /><Input defaultValue="അസ്സലാമു അലൈക്കും. ഒരു ഫത്വ ചോദിക്കാൻ ആഗ്രഹിക്കുന്നു." /></CardContent></Card>
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><Palette className="size-5 text-primary" />Theme</h2><Input defaultValue="Emerald / Gold" /><Input defaultValue="Anek Malayalam" /></CardContent></Card>
        <Card><CardContent className="grid gap-4 pt-5"><h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5 text-primary" />Security</h2><Input defaultValue="Admin, Editor, Viewer" /><Input defaultValue="RLS enabled" /><Button>Save Settings</Button></CardContent></Card>
      </section>
    </>
  );
}
