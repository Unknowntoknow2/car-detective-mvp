
import React from 'react';
import { Input } from '@/components/ui/input';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface YearMileageInputsProps {
  selectedYear: number | '';
  setSelectedYear: (year: number | '') => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
}

export function YearMileageInputs({
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled
}: YearMileageInputsProps) {
  const { getYearOptions } = useVehicleData();

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numberValue = parseInt(value, 10);
    
    if (value === '' || (numberValue > 0 && numberValue <= 999999)) {
      setMileage(value);
    }
  };

  return (
    <>
      <Select 
        onValueChange={(value) => setSelectedYear(Number(value))}
        disabled={isDisabled}
        value={selectedYear ? String(selectedYear) : ''}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {getYearOptions().map(year => (
            <SelectItem 
              key={year} 
              value={String(year)}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input 
        type="text" 
        inputMode="numeric"
        placeholder="Enter Mileage" 
        value={mileage.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        onChange={handleMileageChange}
        disabled={isDisabled}
        className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary"
        onBlur={() => {
          if (mileage === '' || parseInt(mileage, 10) <= 0) {
            toast.error("Mileage must be a positive number greater than zero");
            setMileage('');
          }
        }}
      />
    </>
  );
}
