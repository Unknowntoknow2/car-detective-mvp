
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

export const YearMileageInputs: React.FC<YearMileageInputsProps> = ({
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled = false
}) => {
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
        <SelectTrigger>
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {getYearOptions().map(year => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input 
        type="text" 
        inputMode="numeric"
        placeholder="Enter Mileage" 
        value={mileage}
        onChange={handleMileageChange}
        disabled={isDisabled}
        className="appearance-none"
        onBlur={() => {
          if (mileage === '' || parseInt(mileage, 10) <= 0) {
            toast.error("Mileage must be a positive number greater than zero");
            setMileage('');
          }
        }}
      />
    </>
  );
};
