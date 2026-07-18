"use client";

import { Bookmark, Copy, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareActions({ title, url, downloadable = false }: { title: string; url: string; downloadable?: boolean }) {
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" onClick={share}>
        <Share2 className="size-4" />
        Share
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(url)}>
        <Copy className="size-4" />
        Copy Link
      </Button>
      <Button type="button" size="sm" variant="outline">
        <Bookmark className="size-4" />
        Bookmark
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => window.print()}>
        <Printer className="size-4" />
        Print
      </Button>
      {downloadable ? (
        <Button type="button" size="sm" variant="outline">
          <Download className="size-4" />
          PDF
        </Button>
      ) : null}
    </div>
  );
}
