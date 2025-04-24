
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FuelTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const fuelTypes = [
  { value: 'Gasoline', label: 'Gasoline', description: 'Most common fuel type for passenger vehicles' },
  { value: 'Diesel', label: 'Diesel', description: 'Better fuel economy, higher torque, longer engine life' },
  { value: 'Hybrid', label: 'Hybrid', description: 'Combines gasoline engine with electric motor for improved efficiency' },
  { value: 'Electric', label: 'Electric', description: 'Zero emissions, lower operating costs, instant torque' },
  { value: 'Plug-in Hybrid', label: 'Plug-in Hybrid', description: 'Rechargeable battery with gasoline engine backup' },
  { value: 'Flex Fuel', label: 'Flex Fuel (E85)', description: 'Can run on gasoline or ethanol blend' },
  { value: 'Natural Gas', label: 'Natural Gas (CNG)', description: 'Lower emissions than gasoline, cheaper fuel costs' }
];

export const FuelTypeSelect: React.FC<FuelTypeSelectProps> = ({
  value,
  onChange,
  isDisabled = false
}) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
        <SelectValue placeholder="Select Fuel Type" />
      </SelectTrigger>
      <SelectContent>
        {fuelTypes.map(type => (
          <SelectItem 
            key={type.value} 
            value={type.value}
            className="py-2.5 cursor-pointer hover:bg-primary/10"
          >
            <div className="flex flex-col">
              <span>{type.label}</span>
              <span className="text-xs text-muted-foreground">{type.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
