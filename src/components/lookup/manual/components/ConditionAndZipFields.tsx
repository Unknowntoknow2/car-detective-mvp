
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ConditionOption {
  value: string;
  label: string;
}

interface ConditionAndZipFieldsProps {
  form: any;
  conditionOptions: ConditionOption[];
}

export const ConditionAndZipFields: React.FC<ConditionAndZipFieldsProps> = ({ 
  form, 
  conditionOptions 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Condition & Location</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
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
                <Input 
                  placeholder="e.g. 90210" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Providing accurate condition information and ZIP code helps us determine the most accurate valuation for your area.
        </p>
      </div>
    </div>
  );
};
