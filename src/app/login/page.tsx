import { LoginForm } from "@/app/login/_components/login-form";
import { PageHero } from "@/components/sections/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Admin Login", path: "/login" });

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <PageHero title="Admin Login" description="അഡ്മിൻ, എഡിറ്റർ അംഗങ്ങൾക്ക് Supabase Auth വഴി പ്രവേശിക്കാൻ." />
      <section className="container flex justify-center py-12">
        <LoginForm next={next} />
      </section>
    </>
  );
}
