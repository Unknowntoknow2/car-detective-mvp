
import React from 'react';
import { MakeModelSelect } from './fields/MakeModelSelect';
import { YearMileageInputs } from './fields/YearMileageInputs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface BasicVehicleInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | string | '';
  setSelectedYear: (year: string | number) => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
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
  zipCode,
  setZipCode,
  isDisabled,
  errors = {}
}: BasicVehicleInfoProps) {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MakeModelSelect
          selectedMakeId={selectedMakeId}
          setSelectedMakeId={setSelectedMakeId}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isDisabled={isDisabled}
          errors={errors}
        />
      </div>
      
      <YearMileageInputs
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        mileage={mileage}
        setMileage={setMileage}
        isDisabled={isDisabled}
        errors={errors}
      />
      
      <div className="sm:w-1/2">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
            ZIP Code
          </Label>
          <Input
            id="zipCode"
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={`h-10 transition-all duration-200 ${errors.zipCode ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            disabled={isDisabled}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-xs text-slate-500">
            Your location helps us determine regional market values
          </p>
        </div>
      </div>
    </div>
  );
}
