"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({ nav }: { nav: string[][] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)} aria-label="മെനു തുറക്കുക">
        <Menu className="size-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-bold">മെനു</span>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} aria-label="മെനു അടക്കുക">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="mt-8 grid gap-2">
              {nav.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-4 py-3 text-lg font-semibold hover:bg-muted"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
