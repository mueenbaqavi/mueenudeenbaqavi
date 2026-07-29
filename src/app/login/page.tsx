import { LoginForm } from "@/app/login/_components/login-form";
import { PageHero } from "@/components/sections/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Admin Login", path: "/login" });

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/admin");
  }

  const { next } = await searchParams;

  return (
    <>
      <PageHero title="Admin Login" description="വെബ്സൈറ്റ് നിയന്ത്രിക്കാൻ ലോഗിൻ ചെയ്യുക." />
      <section className="container flex justify-center py-12">
        <LoginForm next={next} />
      </section>
    </>
  );
}
