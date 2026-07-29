import { Info } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-muted/20 w-full col-span-full">
      <Info className="size-10 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground text-lg">ഉടൻ തന്നെ പുതിയ ഉള്ളടക്കങ്ങൾ ഇവിടെ ചേർക്കുന്നതാണ്.</p>
    </div>
  );
}
