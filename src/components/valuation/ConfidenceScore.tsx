
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceScoreProps {
  score: number;
  comparableVehicles: number;
}

export const ConfidenceScore = (
  { score, comparableVehicles }: ConfidenceScoreProps,
) => {
  // Enhanced confidence messaging based on score
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { level: 'High', color: 'text-green-600' };
    if (score >= 65) return { level: 'Good', color: 'text-blue-600' };
    if (score >= 45) return { level: 'Moderate', color: 'text-amber-600' };
    return { level: 'Limited', color: 'text-red-600' };
  };

  const { level, color } = getConfidenceLevel(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Confidence Score
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <p className="font-medium mb-1">Data Confidence Rating</p>
                <p className="text-sm mb-2">
                  Based on {comparableVehicles} comparable listings found.
                </p>
                <div className="text-sm space-y-1">
                  <div>• 80%+ = High confidence with substantial market data</div>
                  <div>• 65-79% = Good confidence with adequate data</div>
                  <div>• 45-64% = Moderate confidence with limited data</div>
                  <div>• &lt;45% = Limited confidence, mostly estimated</div>
                </div>
                {score < 65 && (
                  <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                    ⚠️ Limited market data available for this vehicle
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold text-primary">
          {score}%
        </p>
        <span className={`text-xs font-medium ${color}`}>
          {level}
        </span>
      </div>
      <Progress
        value={score}
        className={`h-2 ${score < 65 ? 'opacity-75' : ''}`}
      />
      {score < 65 && (
        <p className="text-xs text-muted-foreground">
          Valuation based on limited market data
        </p>
      )}
    </div>
  );
};
