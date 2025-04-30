
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface TitleStatusOption {
  value: string;
  label: string;
  multiplier: number;
  description: string;
}

const titleStatusOptions: TitleStatusOption[] = [
  { value: 'Clean', label: 'Clean', multiplier: 1.00, description: 'Clean title – full market value' },
  { value: 'Rebuilt', label: 'Rebuilt', multiplier: 0.70, description: 'Rebuilt/Revived title (approximately -30% value)' },
  { value: 'Lemon', label: 'Lemon', multiplier: 0.75, description: 'Lemon/Buyback title (approximately -25% value)' },
  { value: 'Flood', label: 'Flood', multiplier: 0.50, description: 'Flood damaged title (approximately -50% value)' },
  { value: 'Salvage', label: 'Salvage', multiplier: 0.50, description: 'Salvage title (approximately -50% value)' },
];

interface TitleStatusFactorCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleStatusFactorCard({ value, onChange }: TitleStatusFactorCardProps) {
  // Default to 'Clean' if no value provided
  const [selectedValue, setSelectedValue] = useState<string>(value || 'Clean');

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const selectedOption = titleStatusOptions.find(option => option.value === selectedValue) || titleStatusOptions[0];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Title Status</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>The title status affects vehicle value. Salvage/rebuilt titles can significantly reduce value.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Select value={selectedValue} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select title status" />
            </SelectTrigger>
            <SelectContent>
              {titleStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground ml-2">
                            {option.value !== 'Clean' ? `${Math.round((option.multiplier - 1) * 100)}%` : 'baseline'}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{option.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-xs text-muted-foreground mt-2">
            {selectedOption.description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
