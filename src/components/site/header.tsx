"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/site/mobile-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  ["ജീവചരിത്രം", "/biography"],
  ["ലേഖനങ്ങൾ", "/articles"],
  ["അഹ്‌ലുസ്സുന്ന", "/ahlu-sunnah"],
  ["ഫത്‌വകൾ", "/fatwas"],
  ["ക്ലാസുകൾ", "/classes"],
  ["കോഴ്സുകൾ", "/courses"],
  ["പുസ്തകങ്ങൾ", "/books"],
  ["ബന്ധപ്പെടുക", "/contact"],
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="leading-tight">
            <span className="block text-base">{siteConfig.name}</span>
          </span>
        </Link>
        <nav aria-label="പ്രധാന നാവിഗേഷൻ" className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => {
            const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link 
                key={href} 
                href={href} 
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav nav={nav} />
        </div>
      </div>
    </header>
  );
}
