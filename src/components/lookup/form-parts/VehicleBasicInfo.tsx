
import React from 'react';
import { MakeModelSelect } from './fields/MakeModelSelect';
import { YearMileageInputs } from './fields/YearMileageInputs';
import { FuelTypeSelect } from './fields/FuelTypeSelect';
import { ZipCodeInput } from './ZipCodeInput';

interface VehicleBasicInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | '';
  setSelectedYear: (year: number | '') => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  fuelType: string;
  setFuelType: (type: string) => void;
  condition: string;
  setCondition: (condition: string) => void;
  isDisabled?: boolean;
}

export const VehicleBasicInfo: React.FC<VehicleBasicInfoProps> = ({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  zipCode,
  setZipCode,
  fuelType,
  setFuelType,
  condition,
  setCondition,
  isDisabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MakeModelSelect
        selectedMakeId={selectedMakeId}
        setSelectedMakeId={setSelectedMakeId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isDisabled={isDisabled}
      />

      <YearMileageInputs
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        mileage={mileage}
        setMileage={setMileage}
        isDisabled={isDisabled}
      />

      <FuelTypeSelect
        value={fuelType}
        onChange={setFuelType}
        isDisabled={isDisabled}
      />
      
      <ZipCodeInput
        zipCode={zipCode}
        setZipCode={setZipCode}
        isDisabled={isDisabled}
      />
    </div>
  );
};
