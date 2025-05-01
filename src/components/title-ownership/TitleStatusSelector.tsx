
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface TitleStatusOption {
  value: string;
  label: string;
  description: string;
  impact: string;
}

const titleStatusOptions: TitleStatusOption[] = [
  { 
    value: 'Clean', 
    label: 'Clean Title', 
    description: 'Vehicle has never been seriously damaged, salvaged, or branded as a lemon',
    impact: 'No impact on value'
  },
  { 
    value: 'Salvage', 
    label: 'Salvage Title', 
    description: 'Vehicle was declared a total loss by an insurance company due to damage',
    impact: 'Reduces value by 40-50%'
  },
  { 
    value: 'Rebuilt', 
    label: 'Rebuilt/Reconstructed', 
    description: 'Previously salvaged vehicle that has been repaired and inspected',
    impact: 'Reduces value by 20-30%'
  },
  { 
    value: 'Flood', 
    label: 'Flood Damage', 
    description: 'Vehicle sustained damage from being in a flood',
    impact: 'Reduces value by 40-60%'
  },
  { 
    value: 'Lemon', 
    label: 'Lemon Law Buyback', 
    description: 'Vehicle was repurchased by the manufacturer due to defects',
    impact: 'Reduces value by 15-25%'
  }
];

interface TitleStatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function TitleStatusSelector({ value, onChange, required = false }: TitleStatusSelectorProps) {
  const selectedOption = titleStatusOptions.find(option => option.value === value) || titleStatusOptions[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="title-status" className="text-sm font-medium">
          Title Status {required && <span className="text-red-500">*</span>}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                The title status can significantly impact your vehicle's value. 
                Salvage, rebuilt, or flood titles can reduce value by 20-60%.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="title-status" className="w-full">
          <SelectValue placeholder="Select title status" />
        </SelectTrigger>
        <SelectContent>
          {titleStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.impact}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value && (
        <div className="text-sm mt-1">
          <p className="text-muted-foreground">{selectedOption.description}</p>
          <p className={`mt-1 font-medium ${value === 'Clean' ? 'text-green-600' : 'text-amber-600'}`}>
            {selectedOption.impact}
          </p>
        </div>
      )}
    </div>
  );
}
