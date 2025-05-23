
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface YearMileageInputsProps {
  selectedYear: number | string | '';
  setSelectedYear: (year: number | string | '') => void;
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
  isDisabled = false,
  errors = {}
}: YearMileageInputsProps) {
  const { isLoading } = useVehicleData();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  const handleYearChange = (value: string) => {
    if (value === '') {
      setSelectedYear('');
    } else {
      setSelectedYear(parseInt(value, 10));
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    
    // Format with commas as user types (only if there's a value)
    if (value) {
      const numericValue = parseInt(value.replace(/,/g, ''), 10);
      if (!isNaN(numericValue)) {
        setMileage(numericValue.toLocaleString());
        return;
      }
    }
    
    setMileage(value);
  };

  const handleMileageBlur = () => {
    if (mileage) {
      // Ensure mileage is formatted with commas on blur
      const numericValue = parseInt(mileage.replace(/,/g, ''), 10);
      if (!isNaN(numericValue)) {
        setMileage(numericValue.toLocaleString());
      }
    }
  };

  const handleMileageFocus = () => {
    // Remove commas when focusing for easier editing
    setMileage(mileage.replace(/,/g, ''));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm font-medium text-slate-700">
          Year <span className="text-red-500">*</span>
        </Label>
        
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <>
            <Select
              value={selectedYear !== null && selectedYear !== undefined ? selectedYear.toString() : ''}
              onValueChange={handleYearChange}
              disabled={isDisabled}
            >
              <SelectTrigger 
                id="year" 
                className={`h-10 transition-all duration-200 ${errors.year ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-[350px]">
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.year && <FormValidationError error={errors.year} />}
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mileage" className="text-sm font-medium text-slate-700">
          Mileage <span className="text-red-500">*</span>
        </Label>
        <Input
          id="mileage"
          type="text"
          value={mileage}
          onChange={handleMileageChange}
          onBlur={handleMileageBlur}
          onFocus={handleMileageFocus}
          placeholder="e.g. 45,000"
          className={`h-10 transition-all duration-200 ${errors.mileage ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          disabled={isDisabled}
        />
        {errors.mileage ? (
          <FormValidationError error={errors.mileage} />
        ) : (
          <p className="text-xs text-slate-500">
            Current odometer reading in miles
          </p>
        )}
      </div>
    </>
  );
}
