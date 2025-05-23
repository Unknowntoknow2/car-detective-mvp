
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

interface YearMileageInputsProps {
  form: any;
}

export const YearMileageInputs: React.FC<YearMileageInputsProps> = ({ form }) => {
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Select 
              onValueChange={(value) => {
                if (value === '') {
                  field.onChange('');
                } else {
                  field.onChange(parseInt(value));
                }
              }} 
              defaultValue={field.value !== undefined && field.value !== null ? field.value.toString() : ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {yearOptions.map(year => (
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
                type="text" 
                placeholder="e.g. 45000" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '') {
                    field.onChange('');
                  } else {
                    field.onChange(parseInt(value));
                  }
                }}
                value={field.value !== undefined && field.value !== null ? field.value.toString() : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
