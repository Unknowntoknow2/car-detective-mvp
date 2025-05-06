
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface VehicleConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const conditionDescriptions = {
  poor: "Vehicle has mechanical faults, accident history, or significant interior/exterior damage.",
  fair: "Vehicle shows noticeable wear and tear, might need some minor repairs and maintenance.",
  good: "Vehicle is well-maintained with only minor cosmetic defects and regular service history.",
  excellent: "Vehicle is in near-perfect condition with no mechanical issues and pristine appearance."
};

const conditionTips = {
  poor: "Focus on critical mechanical repairs first. Address safety issues, then consider cosmetic improvements.",
  fair: "Regular maintenance and minor repairs can significantly increase value. Consider detailing service.",
  good: "Maintain current condition with regular service. Address any minor issues promptly to retain value.",
  excellent: "Continue meticulous maintenance. Preserve documentation of service history for best resale value."
};

export const VehicleConditionSlider = ({ 
  value, 
  onChange,
  disabled = false 
}: VehicleConditionSliderProps) => {
  const getConditionLabel = (val: number): string => {
    if (val <= 25) return 'poor';
    if (val <= 50) return 'fair';
    if (val <= 75) return 'good';
    return 'excellent';
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'poor': return 'text-destructive';
      case 'fair': return 'text-amber-500';
      case 'good': return 'text-green-500';
      case 'excellent': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getConditionIcon = (condition: string) => {
    if (condition === 'excellent' || condition === 'good') {
      return <CheckCircle className="h-4 w-4 mr-1" />;
    }
    return <AlertCircle className="h-4 w-4 mr-1" />;
  };

  const currentCondition = getConditionLabel(value);
  const conditionColor = getConditionColor(currentCondition);

  return (
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
                <p className="text-sm font-medium mb-2">How to rate your vehicle condition</p>
                <ul className="text-xs space-y-2">
                  <li className="flex items-start">
                    <span className="text-destructive font-medium mr-1">Poor:</span> 
                    {conditionDescriptions.poor}
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 font-medium mr-1">Fair:</span> 
                    {conditionDescriptions.fair}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 font-medium mr-1">Good:</span> 
                    {conditionDescriptions.good}
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 font-medium mr-1">Excellent:</span> 
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
              <span className={`text-sm font-semibold capitalize flex items-center ${conditionColor} cursor-help`}>
                {getConditionIcon(currentCondition)}
                {currentCondition}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-4">
              <p className="text-sm font-medium mb-2">{conditionDescriptions[currentCondition]}</p>
              <div className="text-xs text-muted-foreground">
                <strong>Improvement Tip:</strong> {conditionTips[currentCondition]}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Slider
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={([newValue]) => onChange(newValue)}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="grid grid-cols-4 text-xs text-muted-foreground">
        <div className="text-left text-destructive">Poor</div>
        <div className="text-center text-amber-500">Fair</div>
        <div className="text-center text-green-500">Good</div>
        <div className="text-right text-blue-500">Excellent</div>
      </div>

      <div className="p-4 bg-slate-50 rounded-md border mt-2">
        <h4 className="text-sm font-semibold mb-1 capitalize">Current: {currentCondition}</h4>
        <p className="text-xs text-muted-foreground">{conditionDescriptions[currentCondition]}</p>
        <div className="mt-2 text-xs flex items-start">
          <AlertCircle className="h-4 w-4 mr-1 shrink-0 mt-0.5 text-amber-500" />
          <span>{conditionTips[currentCondition]}</span>
        </div>
      </div>
    </div>
  );
};
