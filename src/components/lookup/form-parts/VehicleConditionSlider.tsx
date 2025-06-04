<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
=======
import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VehicleConditionSliderProps {
  value?: number;
  onChange: (value: number, label: string) => void;
  disabled?: boolean;
}

// Define the condition levels and their corresponding value ranges
const conditionRanges = {
  poor: { min: 0, max: 25 },
  fair: { min: 26, max: 50 },
  good: { min: 51, max: 75 },
  excellent: { min: 76, max: 100 }
};

// Define descriptions for each condition
const conditionDescriptions = {
<<<<<<< HEAD
  poor: "Vehicle has significant mechanical and/or cosmetic issues requiring major repairs.",
  fair: "Vehicle has noticeable wear and may need some repairs, but is generally functional.",
  good: "Vehicle is in solid mechanical condition with minimal cosmetic issues.",
  excellent: "Vehicle is in exceptional condition, well-maintained, with minimal wear."
};

// Define colors for each condition
const conditionColors = {
  poor: "bg-red-400",
  fair: "bg-yellow-400",
  good: "bg-green-400",
  excellent: "bg-blue-400",
};

export const VehicleConditionSlider: React.FC<VehicleConditionSliderProps> = ({
  value = 75,
  onChange,
  disabled = false
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [currentCondition, setCurrentCondition] = useState<string>('good');
  
  // Function to determine the condition based on slider value
  const getConditionFromValue = (val: number): string => {
    if (val <= conditionRanges.poor.max) return 'poor';
    if (val <= conditionRanges.fair.max) return 'fair';
    if (val <= conditionRanges.good.max) return 'good';
    return 'excellent';
  };
  
  // Function to get the formatted condition label
  const getConditionLabel = (condition: string): string => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };
  
  // Update condition whenever slider value changes
  useEffect(() => {
    const condition = getConditionFromValue(sliderValue);
    setCurrentCondition(condition);
    onChange(sliderValue, getConditionLabel(condition));
  }, [sliderValue, onChange]);
  
  // Function to handle slider change
  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue[0]);
=======
  poor:
    "Vehicle has mechanical faults, accident history, or significant interior/exterior damage.",
  fair:
    "Vehicle shows noticeable wear and tear, might need some minor repairs and maintenance.",
  good:
    "Vehicle is well-maintained with only minor cosmetic defects and regular service history.",
  excellent:
    "Vehicle is in near-perfect condition with no mechanical issues and pristine appearance.",
};

const conditionTips = {
  poor:
    "Focus on critical mechanical repairs first. Address safety issues, then consider cosmetic improvements.",
  fair:
    "Regular maintenance and minor repairs can significantly increase value. Consider detailing service.",
  good:
    "Maintain current condition with regular service. Address any minor issues promptly to retain value.",
  excellent:
    "Continue meticulous maintenance. Preserve documentation of service history for best resale value.",
};

export const VehicleConditionSlider = ({
  value,
  onChange,
  disabled = false,
}: VehicleConditionSliderProps) => {
  const getConditionLabel = (val: number): string => {
    if (val <= 25) return "poor";
    if (val <= 50) return "fair";
    if (val <= 75) return "good";
    return "excellent";
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case "poor":
        return "text-destructive";
      case "fair":
        return "text-amber-500";
      case "good":
        return "text-green-500";
      case "excellent":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getConditionIcon = (condition: string) => {
    if (condition === "excellent" || condition === "good") {
      return <CheckCircle className="h-4 w-4 mr-1" />;
    }
    return <AlertCircle className="h-4 w-4 mr-1" />;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
  
  // Function to handle clicking on a condition button
  const handleConditionClick = (condition: keyof typeof conditionRanges) => {
    if (disabled) return;
    
    // Set slider to middle value of the condition range
    const range = conditionRanges[condition];
    const midpoint = Math.floor((range.min + range.max) / 2);
    setSliderValue(midpoint);
  };
  
  return (
<<<<<<< HEAD
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label className="text-sm font-medium">Vehicle Condition</Label>
        <span className="text-sm font-semibold">
          {getConditionLabel(currentCondition)}
        </span>
=======
    <div className="w-full space-y-6 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <label className="text-sm font-medium mr-2">Vehicle Condition</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4">
                <p className="text-sm font-medium mb-2">
                  How to rate your vehicle condition
                </p>
                <ul className="text-xs space-y-2">
                  <li className="flex items-start">
                    <span className="text-destructive font-medium mr-1">
                      Poor:
                    </span>
                    {conditionDescriptions.poor}
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 font-medium mr-1">
                      Fair:
                    </span>
                    {conditionDescriptions.fair}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 font-medium mr-1">
                      Good:
                    </span>
                    {conditionDescriptions.good}
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-medium mr-1">
                      Excellent:
                    </span>
                    {conditionDescriptions.excellent}
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`text-sm font-semibold capitalize flex items-center ${conditionColor} cursor-help`}
              >
                {getConditionIcon(currentCondition)}
                {currentCondition}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-4">
              <p className="text-sm font-medium mb-2">
                {conditionDescriptions[currentCondition]}
              </p>
              <div className="text-xs text-muted-foreground">
                <strong>Improvement Tip:</strong>{" "}
                {conditionTips[currentCondition]}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>

      <Slider
        value={[sliderValue]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleSliderChange}
        disabled={disabled}
        className="my-6"
      />
<<<<<<< HEAD
      
      <div className="grid grid-cols-4 gap-2">
        {Object.keys(conditionRanges).map((condition) => {
          const isActive = currentCondition === condition;
          // Type assertion to ensure TypeScript knows this is a valid key
          const safeCondition = condition as keyof typeof conditionColors;
          
          return (
            <button
              key={condition}
              type="button"
              className={cn(
                "p-2 rounded text-center text-xs transition-all",
                isActive
                  ? `${conditionColors[safeCondition]} text-white font-medium`
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleConditionClick(safeCondition)}
              disabled={disabled}
            >
              {getConditionLabel(condition)}
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        {/* Use safe indexing with type assertion */}
        {conditionDescriptions[currentCondition as keyof typeof conditionDescriptions]}
=======

      <div className="grid grid-cols-4 text-xs text-muted-foreground">
        <div className="text-left text-destructive">Poor</div>
        <div className="text-center text-amber-500">Fair</div>
        <div className="text-center text-green-500">Good</div>
        <div className="text-right text-blue-500">Excellent</div>
      </div>

      <div className="p-4 bg-slate-50 rounded-md border mt-2">
        <h4 className="text-sm font-semibold mb-1 capitalize">
          Current: {currentCondition}
        </h4>
        <p className="text-xs text-muted-foreground">
          {conditionDescriptions[currentCondition]}
        </p>
        <div className="mt-2 text-xs flex items-start">
          <AlertCircle className="h-4 w-4 mr-1 shrink-0 mt-0.5 text-amber-500" />
          <span>{conditionTips[currentCondition]}</span>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    </div>
  );
};

export default VehicleConditionSlider;
