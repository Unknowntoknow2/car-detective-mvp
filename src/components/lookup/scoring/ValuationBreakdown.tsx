
import React from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ValuationBreakdownItem {
  factor: string;
  impact: number;
  description: string;
}

interface ValuationBreakdownProps {
  valuationBreakdown: ValuationBreakdownItem[];
  baseValue: number;
  comparableVehicles: number;
}

export const ValuationBreakdown = ({ 
  valuationBreakdown,
  baseValue,
  comparableVehicles
}: ValuationBreakdownProps) => {
  return (
    <Popover>
      <PopoverTrigger className="text-sm text-muted-foreground hover:text-primary mt-2 flex items-center gap-1">
        <Info className="h-4 w-4" />
        View detailed breakdown
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h4 className="font-medium">Valuation Breakdown</h4>
            <p className="text-sm text-muted-foreground">
              Based on {comparableVehicles} similar vehicles in your area
            </p>
          </div>
          {valuationBreakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.impact > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span>{item.factor}</span>
              </div>
              <HoverCard>
                <HoverCardTrigger className="flex items-center gap-1">
                  <span className={item.impact > 0 ? "text-green-500" : "text-red-500"}>
                    {item.impact > 0 ? "+" : ""}{item.impact}%
                  </span>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm">{item.description}</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
