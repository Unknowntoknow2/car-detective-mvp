
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';

interface ZipCodeInputProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="zipCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ZIP Code (optional)</FormLabel>
          <FormControl>
            <Input placeholder="e.g., 90210" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
