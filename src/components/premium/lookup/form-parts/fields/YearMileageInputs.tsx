
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface YearMileageInputsProps {
  selectedYear: number | string | '';
  setSelectedYear: (year: string | number) => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function YearMileageInputs({
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled,
  errors = {}
}: YearMileageInputsProps) {
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990);

  const handleYearChange = (value: string) => {
    if (value === '') {
      setSelectedYear('');
    } else {
      setSelectedYear(value);
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMileage(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm font-medium text-slate-700">
          Year
        </Label>
        <Select
          value={selectedYear !== undefined && selectedYear !== null ? selectedYear.toString() : ''}
          onValueChange={handleYearChange}
          disabled={isDisabled}
        >
          <SelectTrigger 
            id="year"
            className={`h-10 transition-all duration-200 ${errors.year ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          >
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.year && <FormValidationError error={errors.year} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mileage" className="text-sm font-medium text-slate-700">
          Mileage
        </Label>
        <Input
          id="mileage"
          type="text"
          value={mileage}
          onChange={handleMileageChange}
          placeholder="e.g. 45000"
          className={`h-10 transition-all duration-200 ${errors.mileage ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          disabled={isDisabled}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
      </div>
    </div>
  );
}
