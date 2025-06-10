
import React from "react";
import { Info } from "lucide-react";

export function VinInfoMessage() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Info className="h-4 w-4" />
      <span>VIN must be exactly 17 characters (letters and numbers)</span>
    </div>
  );
}
