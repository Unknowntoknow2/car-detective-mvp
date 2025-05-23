
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConditionLevel } from '../types/manualEntry';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';

interface ConditionAndFuelInputsProps {
  condition: ConditionLevel;
  setCondition: (condition: ConditionLevel) => void;
  fuelType: string;
  setFuelType: (fuelType: string) => void;
  transmission: string;
  setTransmission: (transmission: string) => void;
}

export const ConditionAndFuelInputs: React.FC<ConditionAndFuelInputsProps> = ({
  condition,
  setCondition,
  fuelType,
  setFuelType,
  transmission,
  setTransmission
}) => {
  return (
    <div className="space-y-6">
      <div>
        <FormLabel className="block text-gray-700 mb-2">Vehicle Condition</FormLabel>
        <ConditionSelectorBar 
          value={condition}
          onChange={setCondition}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="fuelType" className="block text-gray-700 mb-2">Fuel Type</FormLabel>
          <Select 
            value={fuelType} 
            onValueChange={setFuelType}
          >
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <FormLabel htmlFor="transmission" className="block text-gray-700 mb-2">Transmission</FormLabel>
          <Select 
            value={transmission} 
            onValueChange={setTransmission}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
              <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
