
import React from 'react';
import { Badge } from "@/components/ui/badge";

export function CarfaxBadge() {
  return (
    <div className="flex justify-center sm:justify-start">
      <Badge variant="outline" className="bg-primary/5 text-primary py-1.5 px-3 mb-2 font-medium">
        CARFAX® Report Included ($44 value)
      </Badge>
    </div>
  );
}
