
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

interface ConditionInputProps {
  condition: ConditionLevel;
  setCondition: (condition: ConditionLevel) => void;
}

export const ConditionInput: React.FC<ConditionInputProps> = ({
  condition,
  setCondition
}) => {
  const handleChange = (value: string) => {
    setCondition(value as ConditionLevel);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="condition">Vehicle Condition</Label>
        <VehicleFormTooltip 
          content="The condition of your vehicle significantly impacts its value. Be honest for the most accurate valuation."
        />
      </div>
      <Select
        value={condition}
        onValueChange={handleChange}
      >
        <SelectTrigger id="condition">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
          <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
          <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
          <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="text-xs mt-1 text-muted-foreground">
        {condition === ConditionLevel.Excellent && (
          "Like new condition with no visible wear and tear, low mileage."
        )}
        {condition === ConditionLevel.Good && (
          "Normal wear and tear for vehicle age, well maintained, no major issues."
        )}
        {condition === ConditionLevel.Fair && (
          "Shows signs of consistent use, may need minor repairs, some cosmetic issues."
        )}
        {condition === ConditionLevel.Poor && (
          "Significant mechanical or cosmetic issues, may need major repairs."
        )}
      </div>
    </div>
  );
};
