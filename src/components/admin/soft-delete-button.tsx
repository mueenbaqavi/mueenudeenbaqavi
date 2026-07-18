"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SoftDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending} aria-label="Move to trash">
      <Trash2 className="size-4" />
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
