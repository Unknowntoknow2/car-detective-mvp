
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
  value: string;
  tooltipContent: React.ReactNode;
}

const VehicleScoreInfo = ({ label, value, tooltipContent }: VehicleScoreInfoProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export const VehicleScoring = () => {
  const estimatedValue = "$24,500";
  const conditionScore = "85/100";
  const confidenceScore = "92%";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VehicleScoreInfo 
        label="Estimated Value"
        value={estimatedValue}
        tooltipContent={
          <>
            <p className="font-medium mb-1">Value Calculation</p>
            <p className="text-sm">Base value adjusted for:</p>
            <ul className="text-sm list-disc pl-4 mt-1">
              <li>Market trends</li>
              <li>Mileage depreciation</li>
              <li>Regional pricing</li>
            </ul>
            <p className="text-sm mt-2 font-mono">Value = BasePrice - MileageAdj + MarketAdj</p>
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
            <p className="text-sm mt-2 font-mono">Score = (0.3 × Age) + (0.4 × Mileage) + (0.3 × History)</p>
          </>
        }
      />
      <VehicleScoreInfo 
        label="Confidence Score"
        value={confidenceScore}
        tooltipContent={
          <>
            <p className="font-medium mb-1">Data Confidence Rating</p>
            <p className="text-sm">Percentage based on:</p>
            <ul className="text-sm list-disc pl-4 mt-1">
              <li>Data completeness</li>
              <li>Source reliability</li>
              <li>Recent updates</li>
            </ul>
            <p className="text-sm mt-2 font-mono">Confidence = (DataPoints ÷ TotalPossible) × 100</p>
          </>
        }
      />
    </div>
  );
};
