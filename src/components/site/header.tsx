import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { siteConfig } from "@/lib/site";

const nav = [
  ["ജീവചരിത്രം", "/biography"],
  ["ലേഖനങ്ങൾ", "/articles"],
  ["ഫത്വകൾ", "/fatwas"],
  ["ക്ലാസുകൾ", "/classes"],
  ["കോഴ്സുകൾ", "/courses"],
  ["പുസ്തകങ്ങൾ", "/books"],
  ["ബന്ധപ്പെടുക", "/contact"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/88 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="relative size-10 overflow-hidden rounded-md border bg-background">
            <Image src="/icon1.png" alt="" fill sizes="40px" className="object-contain p-1" priority />
          </span>
          <span className="leading-tight">
            <span className="block text-base">{siteConfig.name}</span>
            <span className="block text-xs font-medium text-muted-foreground">Official Knowledge Platform</span>
          </span>
        </Link>
        <nav aria-label="പ്രധാന നാവിഗേഷൻ" className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button size="icon" variant="ghost" className="lg:hidden" aria-label="മെനു തുറക്കുക">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
