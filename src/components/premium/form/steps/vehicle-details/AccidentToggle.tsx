
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AccidentToggleProps {
  hasAccident: string;
  onToggle: (value: string) => void;
  disabled?: boolean;
}

export function AccidentToggle({ 
  hasAccident, 
  onToggle,
  disabled = false 
}: AccidentToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Has this vehicle been in an accident?</span>
      </div>
      
      <RadioGroup 
        value={hasAccident} 
        onValueChange={onToggle}
        className="flex space-x-4 pt-1"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="r-no-accident" />
          <Label htmlFor="r-no-accident" className="cursor-pointer">No</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="r-yes-accident" />
          <Label htmlFor="r-yes-accident" className="cursor-pointer">Yes</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
