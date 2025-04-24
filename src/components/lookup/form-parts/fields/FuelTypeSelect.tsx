
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];

interface FuelTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export const FuelTypeSelect: React.FC<FuelTypeSelectProps> = ({
  value,
  onChange,
  isDisabled = false
}) => {
  return (
    <Select 
      onValueChange={onChange}
      disabled={isDisabled}
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Fuel Type" />
      </SelectTrigger>
      <SelectContent>
        {FUEL_TYPES.map(type => (
          <SelectItem key={type} value={type}>{type}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
