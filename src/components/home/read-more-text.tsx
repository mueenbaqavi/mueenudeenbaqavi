"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ReadMoreText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Find where to split the text based on the user's request
  const cutoffIndex = text.indexOf("വെബ്സൈറ്റിലേക്കു സ്വാഗതം.") + "വെബ്സൈറ്റിലേക്കു സ്വാഗതം.".length;
  
  // If the cutoff text isn't found, just show the whole thing, otherwise split it.
  const shortText = cutoffIndex > "വെബ്സൈറ്റിലേക്കു സ്വാഗതം.".length - 1 ? text.substring(0, cutoffIndex) : text;
  
  return (
    <div className="mt-5 max-w-2xl">
      <p className="text-xl leading-10 text-muted-foreground whitespace-pre-wrap">
        {isExpanded ? text : shortText}
      </p>
      {text.length > cutoffIndex && cutoffIndex > "വെബ്സൈറ്റിലേക്കു സ്വാഗതം.".length - 1 && (
        <Button 
          variant="ghost" 
          className="p-0 h-auto font-bold text-primary mt-2 text-base hover:bg-transparent" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>കുറച്ചുകാണിക്കുക <ChevronUp className="ml-1 size-4" /></>
          ) : (
            <>കൂടുതൽ വായിക്കുക <ChevronDown className="ml-1 size-4" /></>
          )}
        </Button>
      )}
    </div>
  );
}
