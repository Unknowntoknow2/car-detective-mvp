
import React from 'react';
import { Info, TrendingUp, TrendingDown, ChartBar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface ValuationBreakdownItem {
  factor: string;
  impact: number;
  description: string;
}

interface VehicleScoringProps {
  baseValue: number;
  valuationBreakdown: ValuationBreakdownItem[];
  confidenceScore: number;
  estimatedValue: number;
  comparableVehicles: number;
}

const VehicleScoreInfo = ({ 
  label, 
  value, 
  tooltipContent
}: {
  label: string;
  value: string | number;
  tooltipContent: React.ReactNode;
}) => (
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

export const VehicleScoring = ({ 
  baseValue,
  valuationBreakdown,
  confidenceScore,
  estimatedValue,
  comparableVehicles
}: VehicleScoringProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <VehicleScoreInfo 
          label="Estimated Value"
          value={estimatedValue}
          tooltipContent={
            <div>
              <p className="font-medium mb-1">Base Value: ${baseValue.toLocaleString()}</p>
              <p className="text-sm mb-2">Adjustments based on:</p>
              <ul className="text-sm list-disc pl-4">
                {valuationBreakdown.map((item, idx) => (
                  <li key={idx}>{item.factor}: {item.impact > 0 ? '+' : ''}{item.impact}%</li>
                ))}
              </ul>
            </div>
          }
        />
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
      </div>
      
      <VehicleScoreInfo 
        label="Confidence Score"
        value={`${confidenceScore}%`}
        tooltipContent={
          <div>
            <p className="font-medium mb-1">Data Confidence Rating</p>
            <p className="text-sm">Based on {comparableVehicles} comparable vehicles in your area.</p>
            <ul className="text-sm list-disc pl-4 mt-2">
              <li>Market sample size</li>
              <li>Data completeness</li>
              <li>Regional price accuracy</li>
            </ul>
          </div>
        }
      />
      
      <VehicleScoreInfo 
        label="Market Analysis"
        value={`${comparableVehicles} Comparables`}
        tooltipContent={
          <div>
            <p className="font-medium mb-1">Market Data Analysis</p>
            <p className="text-sm">Based on real sales data from {comparableVehicles} similar vehicles sold in your region in the last 30 days.</p>
          </div>
        }
      />
    </div>
  );
};
