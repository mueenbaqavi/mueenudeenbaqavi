"use client";

import { Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareActions({ title, url, downloadable = false }: { title: string; url: string; downloadable?: boolean }) {
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="outline" onClick={share}>
        <Share2 className="size-4" />
        Share
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={copyLink}>
        <Copy className="size-4" />
        Copy Link
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
