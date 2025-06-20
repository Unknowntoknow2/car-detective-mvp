
import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConditionLevel, CONDITION_OPTIONS } from "@/types/condition";

interface Props {
  value: ConditionLevel;
  onChange: (val: ConditionLevel) => void;
}

const CONDITION_TOOLTIPS: Record<ConditionLevel, string> = {
  [ConditionLevel.Poor]: "Major mechanical or cosmetic issues. Needs repairs before resale.",
  [ConditionLevel.Fair]: "Works but has flaws. Needs service, repairs, or cosmetic touch-ups.",
  [ConditionLevel.Good]: "Typical used car with minor wear. Drives fine, no major problems.",
  [ConditionLevel.VeryGood]: "Well maintained, clean inside and out. No real issues.",
  [ConditionLevel.Excellent]: "Looks and drives like new. One-owner condition, clean history.",
};

export const ConditionSelectorSegmented: React.FC<Props> = ({ value, onChange }) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Vehicle Condition
        </label>
        <div className="flex gap-2 flex-wrap">
          {CONDITION_OPTIONS.map(({ value: conditionValue, label }) => (
            <Tooltip key={conditionValue}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(conditionValue as ConditionLevel)}
                  className={cn(
                    "px-3 py-2 rounded-md text-xs font-semibold border transition-all",
                    value === conditionValue
                      ? "bg-blue-600 text-white border-blue-700 shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
                  )}
                >
                  {label}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {CONDITION_TOOLTIPS[conditionValue as ConditionLevel]}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export { ConditionLevel };
