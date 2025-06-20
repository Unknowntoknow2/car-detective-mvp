
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ConditionType = 'overall' | 'exterior' | 'interior' | 'tire';

interface ConditionOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface UnifiedConditionSelectorProps {
  type: ConditionType;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'buttons' | 'segmented' | 'bar';
  showTooltips?: boolean;
  disabled?: boolean;
}

const getConditionOptions = (type: ConditionType): ConditionOption[] => {
  const baseOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new condition', color: 'bg-green-100 border-green-500 text-green-800' },
    { value: 'very-good', label: 'Very Good', description: 'Well maintained', color: 'bg-blue-100 border-blue-500 text-blue-800' },
    { value: 'good', label: 'Good', description: 'Normal wear', color: 'bg-gray-100 border-gray-500 text-gray-800' },
    { value: 'fair', label: 'Fair', description: 'Some wear and tear', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
    { value: 'poor', label: 'Poor', description: 'Needs significant work', color: 'bg-red-100 border-red-500 text-red-800' },
  ];

  switch (type) {
    case 'tire':
      return [
        { value: 'excellent', label: 'Like New', description: 'New or nearly new tires', color: 'bg-green-100 border-green-500 text-green-800' },
        { value: 'good', label: 'Good Tread', description: 'Good tread depth remaining', color: 'bg-blue-100 border-blue-500 text-blue-800' },
        { value: 'fair', label: 'Worn', description: 'Some tread wear visible', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
        { value: 'poor', label: 'Needs Replacement', description: 'Requires new tires soon', color: 'bg-red-100 border-red-500 text-red-800' },
      ];
    default:
      return baseOptions;
  }
};

const getTooltipContent = (type: ConditionType, value: string): string => {
  const tooltips = {
    overall: {
      poor: "Major mechanical or cosmetic issues. Needs repairs before resale.",
      fair: "Works but has flaws. Needs service, repairs, or cosmetic touch-ups.",
      good: "Typical used car with minor wear. Drives fine, no major problems.",
      'very-good': "Well maintained, clean inside and out. No real issues.",
      excellent: "Looks and drives like new. One-owner condition, clean history.",
    },
    exterior: {
      poor: "Significant body damage, rust, or paint issues.",
      fair: "Noticeable scratches, dents, or paint fading.",
      good: "Minor imperfections but overall good appearance.",
      'very-good': "Excellent appearance with minimal wear.",
      excellent: "Showroom condition exterior.",
    },
    interior: {
      poor: "Significant wear, stains, or damage to seats/trim.",
      fair: "Noticeable wear but functional.",
      good: "Normal wear for age with minor imperfections.",
      'very-good': "Well-maintained interior with minimal wear.",
      excellent: "Like-new interior condition.",
    },
    tire: {
      poor: "Tires need immediate replacement for safety.",
      fair: "Tires showing wear but still functional.",
      good: "Good tread depth remaining.",
      excellent: "New or nearly new tires.",
    },
  };

  return tooltips[type]?.[value as keyof typeof tooltips[typeof type]] || '';
};

export const UnifiedConditionSelector: React.FC<UnifiedConditionSelectorProps> = ({
  type,
  value,
  onChange,
  className = '',
  variant = 'buttons',
  showTooltips = true,
  disabled = false,
}) => {
  const options = getConditionOptions(type);

  const renderButton = (option: ConditionOption) => {
    const isSelected = value === option.value;
    
    const button = (
      <Button
        key={option.value}
        variant={isSelected ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(option.value)}
        disabled={disabled}
        className={cn(
          "flex flex-col items-center p-3 h-auto transition-all",
          variant === 'segmented' && [
            "px-3 py-2 rounded-md text-xs font-semibold border",
            isSelected
              ? "bg-blue-600 text-white border-blue-700 shadow"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
          ],
          variant === 'bar' && [
            "px-4 py-2 rounded-lg border-2 text-sm font-medium",
            isSelected && option.color,
            !isSelected && "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
          ]
        )}
      >
        <span className="font-medium">{option.label}</span>
        {variant === 'buttons' && option.description && (
          <span className="text-xs text-muted-foreground">
            {option.description}
          </span>
        )}
      </Button>
    );

    if (showTooltips && variant !== 'buttons') {
      return (
        <Tooltip key={option.value}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {getTooltipContent(type, option.value)}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        <div className={cn(
          "flex gap-2",
          variant === 'buttons' && "flex-wrap",
          variant === 'segmented' && "flex-wrap",
          variant === 'bar' && "space-x-2"
        )}>
          {options.map(renderButton)}
        </div>
        {value && variant === 'buttons' && (
          <Badge variant="secondary" className="mt-2">
            Selected: {options.find(c => c.value === value)?.label}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
};

export default UnifiedConditionSelector;
