
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

interface ConditionAndZipFieldsProps {
  form: UseFormReturn<any>;
  conditionOptions: Array<{value: string, label: string}>;
}

export const ConditionAndZipFields: React.FC<ConditionAndZipFieldsProps> = ({ 
  form,
  conditionOptions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Condition</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || ConditionLevel.Good}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {conditionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              How would you rate the overall condition of your vehicle?
            </FormDescription>
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
              <Input placeholder="e.g. 90210" {...field} />
            </FormControl>
            <FormDescription>
              Your location helps us determine local market value
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
