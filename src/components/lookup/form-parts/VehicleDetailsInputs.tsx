
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { ZipCodeInput } from './ZipCodeInput';
import { toast } from 'sonner';
import { ZipCodeField } from '@/components/premium/lookup/form-parts/fields/ZipCodeField';

interface VehicleDetailsInputsProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const VehicleDetailsInputs: React.FC<VehicleDetailsInputsProps> = ({ form }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
    const value = e.target.value;
    const numberValue = parseInt(value, 10);
    
    if (value === '') {
      onChange(0);
    } else if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 500000) {
      onChange(numberValue);
    } else {
      toast.error('Please enter a valid mileage between 0 and 500,000');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value, 10))}
              value={field.value ? field.value.toString() : undefined}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mileage</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min={0}
                max={500000}
                step={100}
                placeholder="e.g., 25000"
                {...field}
                value={field.value === '0' ? '' : field.value}
                onChange={(e) => handleMileageChange(e, field.onChange)}
                className="h-12"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <ZipCodeField
        form={form}
        name="zipCode"
        label="ZIP Code"
        placeholder="Enter ZIP code"
      />
    </div>
  );
};
