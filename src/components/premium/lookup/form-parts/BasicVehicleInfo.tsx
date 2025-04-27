
import React from 'react';
import { MakeModelSelect } from '@/components/premium/lookup/form-parts/fields/MakeModelSelect';
import { YearMileageInputs } from '@/components/premium/lookup/form-parts/fields/YearMileageInputs';

interface BasicVehicleInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | '';
  setSelectedYear: (year: number | '') => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
}

export function BasicVehicleInfo({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled
}: BasicVehicleInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MakeModelSelect
          selectedMakeId={selectedMakeId}
          setSelectedMakeId={setSelectedMakeId}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isDisabled={isDisabled}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <YearMileageInputs
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          mileage={mileage}
          setMileage={setMileage}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}
