
import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export interface BreakdownItemProps {
  factor: string;
  impact: number;
  description: string; // Required field
}

export const BreakdownItem = ({ factor, impact, description }: BreakdownItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {impact > 0 ? (
        <TrendingUp className="h-4 w-4 text-green-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-500" />
      )}
      <span>{factor}</span>
    </div>
    <HoverCard>
      <HoverCardTrigger className="flex items-center gap-1">
        <span className={impact > 0 ? "text-green-500" : "text-red-500"}>
          {impact > 0 ? "+" : ""}{impact}%
        </span>
        <Info className="h-3 w-3 text-muted-foreground" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="text-sm">{description}</p>
      </HoverCardContent>
    </HoverCard>
  </div>
);
