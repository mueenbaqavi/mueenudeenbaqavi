"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileQuestion, FileText, Images, LayoutDashboard, PlayCircle, Settings, ShieldCheck, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: BookOpen },
  { label: "New Article", href: "/admin/articles/new", icon: BookOpen },
  { label: "Books", href: "/admin/books", icon: Library },
  { label: "New Book", href: "/admin/books/new", icon: Library },
  { label: "Ahlu-Sunnah", href: "/admin/ahlu-sunnah", icon: ShieldCheck },
  { label: "New Ahlu-Sunnah", href: "/admin/ahlu-sunnah/new", icon: ShieldCheck },
  { label: "Fatwas", href: "/admin/fatwas", icon: FileQuestion },
  { label: "New Fatwa", href: "/admin/fatwas/new", icon: FileQuestion },
  { label: "Courses", href: "/admin/courses", icon: FileText },
  { label: "Classes", href: "/admin/classes", icon: PlayCircle },
  { label: "New Class", href: "/admin/classes/new", icon: PlayCircle },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto border-b bg-muted/35 px-4 py-3">
      <div className="container flex gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors",
                isActive 
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
