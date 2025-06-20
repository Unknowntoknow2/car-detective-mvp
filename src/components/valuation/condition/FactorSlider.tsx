
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ConditionOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
}

interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (id: string, value: number) => void;
  ariaLabel?: string;
}

export function FactorSlider({
  id,
  label,
  options,
  value,
  onChange,
  ariaLabel,
}: FactorSliderProps) {
  const handleOptionClick = (optionValue: number) => {
    onChange(id, optionValue);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const button = (
            <Button
              key={option.id || index}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleOptionClick(option.value)}
              className={`text-xs ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
              aria-label={ariaLabel}
            >
              {option.label}
            </Button>
          );

          if (option.tip) {
            return (
              <TooltipProvider key={option.id || index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{option.tip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return button;
        })}
      </div>
    </div>
  );
}
