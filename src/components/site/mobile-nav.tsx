"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav({ nav }: { nav: string[][] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const mobileNav = [
    ["ഹോം", "/"],
    ...nav.filter(([, href]) => href !== "/")
  ];

  return (
    <div className="lg:hidden">
      <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)} aria-label="മെനു തുറക്കുക">
        <Menu className="size-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div className="relative z-50 h-full w-full max-w-sm border-l bg-background p-6 shadow-lg animate-in slide-in-from-right-full duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold">മെനു</span>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} aria-label="മെനു അടക്കുക">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2">
              {mobileNav.map(([label, href]) => {
                const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-md px-4 py-3 text-lg font-semibold transition-all border-l-4",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
