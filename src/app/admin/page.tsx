import Link from "next/link";
import { Activity, BookOpen, FileQuestion, Images, LayoutDashboard, Settings, ShieldCheck, Users, LogOut } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminModules } from "@/lib/constants";
import { createMetadata } from "@/lib/site";
import { signOutAction } from "@/app/login/actions";

export const metadata = createMetadata({ title: "Admin Dashboard", path: "/admin" });

import { getAdminDashboardStats } from "@/lib/admin-content-repository";

const quickActions = [
  ["Create Article", "/admin/articles/new"],
  ["Create Fatwa", "/admin/fatwas/new"],
  ["Open Media", "/admin/media"],
  ["Site Settings", "/admin/settings"],
];

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const dynamicStats = await getAdminDashboardStats();
  
  const stats = [
    ["Published", dynamicStats.published.toString(), BookOpen],
    ["Fatwas", dynamicStats.fatwas.toString(), FileQuestion],
    ["Media Assets", dynamicStats.media.toString(), Images],
    ["Users", dynamicStats.users.toString(), Users],
  ];

  return (
    <>
      <PageHero title="Admin Dashboard" description="Role-based Supabase Auth, RLS, editor workflow, SEO, analytics, media library, audit logs എന്നിവയ്ക്കായി തയ്യാറാക്കിയ നിയന്ത്രണകേന്ദ്രം." />
      <section className="container py-12">
        <div className="mb-8 flex justify-end">
          <form action={signOutAction}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </form>
        </div>
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
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
