
// src/components/lookup/form-parts/ConditionSelectorSegmented.tsx

import React from "react";
import { ConditionLevel } from "@/components/lookup/types/manualEntry";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  value: ConditionLevel;
  onChange: (val: ConditionLevel) => void;
}

const CONDITION_LEVELS: { level: ConditionLevel; tip: string }[] = [
  {
    level: ConditionLevel.Poor,
    tip: "Major mechanical or cosmetic issues. Needs repairs before resale.",
  },
  {
    level: ConditionLevel.Fair,
    tip: "Works but has flaws. Needs service, repairs, or cosmetic touch-ups.",
  },
  {
    level: ConditionLevel.Good,
    tip: "Typical used car with minor wear. Drives fine, no major problems.",
  },
  {
    level: ConditionLevel.VeryGood,
    tip: "Well maintained, clean inside and out. No real issues.",
  },
  {
    level: ConditionLevel.Excellent,
    tip: "Looks and drives like new. One-owner condition, clean history.",
  },
];

export const ConditionSelectorSegmented: React.FC<Props> = ({ value, onChange }) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Vehicle Condition</label>
        <div className="flex gap-2 flex-wrap">
          {CONDITION_LEVELS.map(({ level, tip }) => (
            <Tooltip key={level}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(level)}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-semibold border transition-all",
                    value === level
                      ? "bg-blue-600 text-white border-blue-700 shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {level}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{tip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
