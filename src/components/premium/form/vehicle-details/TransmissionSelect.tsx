
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TransmissionOption {
  value: string;
  label: string;
  tooltip: string;
}

const TRANSMISSION_OPTIONS: TransmissionOption[] = [
  {
    value: 'Automatic',
    label: 'Automatic',
    tooltip: 'Standard transmission type with broad market appeal'
  },
  {
    value: 'Manual',
    label: 'Manual',
    tooltip: 'Traditional stick shift. Less popular in modern market, appeals to enthusiasts'
  },
  {
    value: 'CVT',
    label: 'CVT',
    tooltip: 'Continuously Variable Transmission. Smooth operation but concerns about longevity'
  },
  {
    value: 'Dual-Clutch',
    label: 'Dual-Clutch',
    tooltip: 'Performance-oriented transmission with quick gear changes. Premium feature'
  }
];

interface TransmissionSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TransmissionSelect({ 
  value, 
  onChange, 
  disabled = false 
}: TransmissionSelectProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base font-medium">Transmission Type</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">The transmission type affects your vehicle's valuation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4 pt-2"
        disabled={disabled}
      >
        {TRANSMISSION_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-start gap-2">
            <RadioGroupItem 
              value={option.value} 
              id={`transmission-${option.value}`}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <Label 
                htmlFor={`transmission-${option.value}`}
                className="font-medium"
              >
                {option.label}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                      Learn more <HelpCircle className="h-3 w-3" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <p>{option.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
