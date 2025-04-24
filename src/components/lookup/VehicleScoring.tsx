
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

interface VehicleScoreInfoProps {
  label: string;
  value: string;
  tooltipContent: React.ReactNode;
  icon?: React.ReactNode;
  breakdown?: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

const VehicleScoreInfo = ({ 
  label, 
  value, 
  tooltipContent, 
  icon, 
  breakdown 
}: VehicleScoreInfoProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {breakdown ? (
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4 pb-2 border-b">
              <h4 className="font-medium text-sm">Valuation Breakdown</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Factors affecting this vehicle's value
              </p>
            </div>
            <div className="p-2">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 text-sm">
                  <span className="flex items-center gap-2">
                    {item.impact > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : item.impact < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <ChartBar className="h-4 w-4 text-primary" />
                    )}
                    {item.factor}
                  </span>
                  <div className="flex items-center">
                    <span className={`font-medium ${
                      item.impact > 0 
                        ? 'text-green-500' 
                        : item.impact < 0 
                          ? 'text-red-500' 
                          : ''
                    }`}>
                      {item.impact > 0 ? '+' : ''}{item.impact}%
                    </span>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="h-3 w-3 ml-1 opacity-50 cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="text-xs p-2 w-60">
                        {item.description}
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t text-xs text-center text-muted-foreground">
                Base on data from 117 similar vehicles in your area
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
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
      )}
    </div>
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      <p className={`text-lg font-semibold ${label === "Confidence Score" ? "text-primary" : ""}`}>{value}</p>
    </div>
  </div>
);

export const VehicleScoring = () => {
  // Sample data - in a real app, this would come from props or context
  const estimatedValue = "$24,500";
  const conditionScore = "85/100";
  const confidenceScore = "92%";

  const valuationBreakdown = [
    {
      factor: "Mileage",
      impact: -3.5,
      description: "Vehicle has higher mileage than average (76,000 mi vs. market avg of 65,000 mi)"
    },
    {
      factor: "Condition",
      impact: 2.0,
      description: "Vehicle condition is above average based on service history and reported condition"
    },
    {
      factor: "Location",
      impact: 1.5,
      description: "Vehicle prices in your ZIP code are slightly higher than national average"
    },
    {
      factor: "Market Demand",
      impact: 4.0,
      description: "This model currently has high demand in your region (based on 30-day sales data)"
    },
    {
      factor: "Age Depreciation",
      impact: -2.5,
      description: "Standard depreciation for a vehicle of this age and model year"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <VehicleScoreInfo 
        label="Estimated Value"
        value={estimatedValue}
        icon={<ChartBar className="h-5 w-5 text-primary" />}
        breakdown={valuationBreakdown}
        tooltipContent={
          <>
            <p className="font-medium mb-1">Value Calculation</p>
            <p className="text-sm">Base value adjusted for:</p>
            <ul className="text-sm list-disc pl-4 mt-1">
              <li>Market trends</li>
              <li>Mileage depreciation</li>
              <li>Regional pricing</li>
            </ul>
          </>
        }
      />
      <VehicleScoreInfo 
        label="Condition Score"
        value={conditionScore}
        tooltipContent={
          <>
            <p className="font-medium mb-1">Condition Score Calculation</p>
            <p className="text-sm">Weighted score based on:</p>
            <ul className="text-sm list-disc pl-4 mt-1">
              <li>Age (30%)</li>
              <li>Mileage (40%)</li>
              <li>Service History (30%)</li>
            </ul>
          </>
        }
      />
      <VehicleScoreInfo 
        label="Confidence Score"
        value={confidenceScore}
        tooltipContent={
          <>
            <p className="font-medium mb-1">Data Confidence Rating</p>
            <p className="text-sm">Based on 117 comparable vehicles sold in your area.</p>
            <p className="text-sm mt-2">Score considers:</p>
            <ul className="text-sm list-disc pl-4 mt-1">
              <li>Data completeness</li>
              <li>Market sample size</li>
              <li>Regional data accuracy</li>
            </ul>
          </>
        }
      />
    </div>
  );
};
