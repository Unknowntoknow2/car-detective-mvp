
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VehicleScoreInfoProps {
  label: string;
  value: string | number;
  tooltipContent: React.ReactNode;
}

export const VehicleScoreInfo = ({ 
  label, 
  value, 
  tooltipContent
}: VehicleScoreInfoProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <p className={`text-lg font-semibold ${label === "Confidence Score" ? "text-primary" : ""}`}>
      {typeof value === 'number' && label !== "Confidence Score" 
        ? `$${value.toLocaleString()}`
        : value}
    </p>
  </div>
);
