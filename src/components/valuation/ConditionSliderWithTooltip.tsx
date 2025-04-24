
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DesignCard } from "@/components/ui/design-system";
import { Info, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const ConditionSliderWithTooltip: React.FC<ConditionSliderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getConditionLabel = (value: number): string => {
    if (value <= 25) return "Poor";
    if (value <= 50) return "Fair";
    if (value <= 75) return "Good";
    return "Excellent";
  };

  const getConditionIcon = (value: number) => {
    if (value <= 25) return <XCircle className="h-5 w-5 text-error" />;
    if (value <= 50) return <AlertCircle className="h-5 w-5 text-warning" />;
    if (value <= 75) return <Info className="h-5 w-5 text-info" />;
    return <CheckCircle className="h-5 w-5 text-success" />;
  };

  const getConditionDescription = (value: number): string => {
    if (value <= 25)
      return "Vehicle has significant mechanical issues, extensive body damage, or requires major repairs. May affect value by -15% to -20%.";
    if (value <= 50)
      return "Vehicle has some mechanical or cosmetic issues that need attention but is operational. May affect value by -7.5% to -10%.";
    if (value <= 75)
      return "Vehicle is in good working condition with minor wear and tear expected for its age. This is the baseline value (0% adjustment).";
    return "Vehicle is in exceptional condition with minimal wear. Well maintained and may have service records. May increase value by 5% to 10%.";
  };

  const getConditionColor = (value: number): string => {
    if (value <= 25) return "from-error/30 to-error/10";
    if (value <= 50) return "from-warning/30 to-warning/10";
    if (value <= 75) return "from-info/30 to-info/10";
    return "from-success/30 to-success/10";
  };

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Vehicle Condition</h3>
        <div className="flex items-center gap-2">
          <span className="text-md font-semibold flex items-center gap-2">
            {getConditionIcon(value)}
            {getConditionLabel(value)}
          </span>
          <span className="text-sm text-muted-foreground">({value}%)</span>
        </div>
      </div>

      <div className="py-4">
        <TooltipProvider>
          <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
            <TooltipTrigger asChild>
              <div
                className="relative pt-6 pb-6"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Slider
                  disabled={disabled}
                  value={[value]}
                  onValueChange={handleValueChange}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                  <span className="h-3 w-px bg-border"></span>
                  <span className="h-3 w-px bg-border"></span>
                  <span className="h-3 w-px bg-border"></span>
                  <span className="h-3 w-px bg-border"></span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 p-0 overflow-hidden"
            >
              <DesignCard
                variant="outline"
                className={`bg-gradient-to-br ${getConditionColor(
                  value
                )} border-none p-3`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getConditionIcon(value)}
                    <span className="font-semibold">
                      {getConditionLabel(value)} Condition
                    </span>
                  </div>
                  <p className="text-sm">{getConditionDescription(value)}</p>
                </div>
              </DesignCard>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
