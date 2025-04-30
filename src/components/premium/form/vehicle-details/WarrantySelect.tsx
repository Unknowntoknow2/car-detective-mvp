
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface WarrantySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function WarrantySelect({ 
  value, 
  onChange, 
  disabled = false 
}: WarrantySelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="warranty-status" className="text-base font-medium">
          Warranty Status
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Warranty status can affect your vehicle's value. Factory and extended warranties generally increase value.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="warranty-status" className="w-full">
          <SelectValue placeholder="Select warranty status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="None">None</SelectItem>
          <SelectItem value="Factory">Factory Warranty</SelectItem>
          <SelectItem value="Extended/CPO">Extended/CPO Warranty</SelectItem>
        </SelectContent>
      </Select>
      
      {value === 'Factory' && (
        <p className="text-sm text-green-600">
          Factory warranty typically increases a vehicle's value by ~2%
        </p>
      )}
      
      {value === 'Extended/CPO' && (
        <p className="text-sm text-green-600">
          Extended/CPO warranty typically increases a vehicle's value by ~4%
        </p>
      )}
    </div>
  );
}
