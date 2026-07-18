import Link from "next/link";
import { Activity, BookOpen, FileQuestion, Images, LayoutDashboard, Settings, ShieldCheck, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminModules } from "@/data/content";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Admin Dashboard", path: "/admin" });

const stats = [
  ["Published", "128", BookOpen],
  ["Fatwas", "42", FileQuestion],
  ["Media Assets", "356", Images],
  ["Users", "8", Users],
];

const quickActions = [
  ["Create Article", "/admin/articles/new"],
  ["Create Fatwa", "/admin/fatwas/new"],
  ["Open Media", "/admin/media"],
  ["Site Settings", "/admin/settings"],
];

export default function AdminPage() {
  return (
    <>
      <PageHero title="Admin Dashboard" description="Role-based Supabase Auth, RLS, editor workflow, SEO, analytics, media library, audit logs എന്നിവയ്ക്കായി തയ്യാറാക്കിയ നിയന്ത്രണകേന്ദ്രം." />
      <section className="container py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Card key={label as string}>
              <CardContent className="pt-5">
                <Icon className="size-5 text-primary" />
                <p className="mt-4 text-3xl font-bold">{value as string}</p>
                <p className="text-sm text-muted-foreground">{label as string}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardContent className="pt-5">
              <h2 className="flex items-center gap-2 text-xl font-bold"><LayoutDashboard className="size-5" />Content Modules</h2>
              <div className="mt-5 flex flex-wrap gap-2">{adminModules.map((module) => <Badge key={module}>{module}</Badge>)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <h2 className="flex items-center gap-2 text-xl font-bold"><Activity className="size-5" />Recent Activities</h2>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground"><p>Draft autosaved</p><p>SEO score recalculated</p><p>Media uploaded</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5" />Security Architecture</h2>
              <p className="mt-3 leading-8 text-muted-foreground">Admin/editor roles, RLS policies, validation, rate limiting, audit fields, soft delete, revision history.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <h2 className="flex items-center gap-2 text-xl font-bold"><Settings className="size-5" />Editor Workflow</h2>
              <p className="mt-3 leading-8 text-muted-foreground">Rich text, markdown, image upload, auto slug, autosave, draft, publish, schedule, preview, reading time.</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {quickActions.map(([label, href]) => (
            <Link key={href} href={href}>
              <Card className="transition hover:border-primary">
                <CardContent className="pt-5 font-bold">{label}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
