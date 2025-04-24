
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { ZipCodeInput } from './ZipCodeInput';

interface VehicleDetailsInputsProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const VehicleDetailsInputs: React.FC<VehicleDetailsInputsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g., 2020" 
                {...field} 
                value={field.value === 0 ? '' : field.value.toString()}
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              />
            </FormControl>
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
                placeholder="e.g., 25000" 
                {...field} 
                value={field.value === 0 ? '' : field.value.toString()}
                onChange={(e) => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ZIP Code</FormLabel>
            <FormControl>
              <ZipCodeInput 
                zipCode={field.value || ''} 
                setZipCode={(value) => field.onChange(value)}
                isDisabled={form.formState.isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
