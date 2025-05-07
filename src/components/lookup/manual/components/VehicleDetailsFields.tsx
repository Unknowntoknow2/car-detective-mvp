
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface VehicleDetailsFieldsProps {
  form: UseFormReturn<any>;
}

export const VehicleDetailsFields: React.FC<VehicleDetailsFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 2019" {...field} />
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
              <Input placeholder="e.g., 50000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
