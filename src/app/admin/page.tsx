import Link from "next/link";
import { BookOpen, FileQuestion, LayoutDashboard, FileText, PlayCircle, Users, LogOut } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";
import { signOutAction } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminDashboardStats } from "@/lib/admin-content-repository";
import { ShieldCheck, Library } from "lucide-react"; 

export const metadata = createMetadata({ title: "Admin Dashboard", path: "/admin" });

const quickActions = [
  ["Create Article", "/admin/articles/new", BookOpen],
  ["Create Book", "/admin/books/new", Library],
  ["Create Ahlu-Sunnah", "/admin/ahlu-sunnah/new", ShieldCheck],
  ["Create Fatwa", "/admin/fatwas/new", FileQuestion],
  ["Create Course", "/admin/courses/new", FileText],
  ["Create Class", "/admin/classes/new", PlayCircle],
];

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const dynamicStats = await getAdminDashboardStats();
  
  const stats = [
    ["Published Articles", dynamicStats.published.toString(), BookOpen],
    ["Total Fatwas", dynamicStats.fatwas.toString(), FileQuestion],
    ["Users", dynamicStats.users.toString(), Users],
  ];

  return (
    <>
      <PageHero title="Admin Dashboard" description="മുഈനുദ്ദീൻ ബാഖവി വെബ്സൈറ്റിലെ ലേഖനങ്ങൾ, ഫത്വകൾ, ക്ലാസുകൾ, കോഴ്സുകൾ എന്നിവ നിയന്ത്രിക്കാനുള്ള കേന്ദ്രം." />
      <section className="container py-12">
        <div className="mb-8 flex justify-end">
          <form action={signOutAction}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </form>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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
        
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2"><LayoutDashboard className="size-5" /> Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-6">
            {quickActions.map(([label, href, Icon]) => (
              <Link key={href as string} href={href as string}>
                <Card className="transition hover:border-primary group">
                  <CardContent className="pt-5 flex flex-col items-center gap-3 text-center">
                    <Icon className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-bold">{label as string}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
