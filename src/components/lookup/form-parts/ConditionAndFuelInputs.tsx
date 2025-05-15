
import React, { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';
import { ConditionLevel } from '../types/manualEntry';

interface ConditionAndFuelInputsProps {
  condition: ConditionLevel;
  setCondition: Dispatch<SetStateAction<ConditionLevel>>;
  fuelType: string;
  setFuelType: (value: string) => void;
  transmission: string;
  setTransmission: (value: string) => void;
  showAdvanced?: boolean;
}

export const ConditionAndFuelInputs: React.FC<ConditionAndFuelInputsProps> = ({
  condition,
  setCondition,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  showAdvanced = true
}) => {
  // Handle condition change with proper type casting
  const handleConditionChange = (value: string) => {
    setCondition(value as ConditionLevel);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="condition">Condition</Label>
          <VehicleFormTooltip 
            content="Vehicle condition affects valuation significantly. Be honest for the most accurate estimate."
          />
        </div>
        <Select
          value={condition}
          onValueChange={handleConditionChange}
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
      </div>

      {showAdvanced && (
        <>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <VehicleFormTooltip 
                content="The type of fuel your vehicle uses."
              />
            </div>
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
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Plugin Hybrid">Plug-in Hybrid</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="transmission">Transmission</Label>
              <VehicleFormTooltip 
                content="The type of transmission in your vehicle."
              />
            </div>
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
                <SelectItem value="SemiAutomatic">Semi-Automatic</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};
