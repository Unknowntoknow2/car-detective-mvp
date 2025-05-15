
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { validateVin } from '@/utils/validation/vin-validation';

interface VinInputFieldProps {
  form: UseFormReturn<any>;
}

export const VinInputField: React.FC<VinInputFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="vin"
      render={({ field }) => (
        <FormItem>
          <FormLabel>VIN (Optional)</FormLabel>
          <FormControl>
            <Input
              placeholder="Vehicle Identification Number"
              {...field}
              onBlur={(e) => {
                // Custom validation on blur
                if (e.target.value) {
                  const validation = validateVin(e.target.value);
                  if (!validation.isValid) {
                    form.setError('vin', { 
                      type: 'manual', 
                      message: validation.message || 'Invalid VIN' 
                    });
                  } else {
                    form.clearErrors('vin');
                  }
                }
                field.onBlur();
              }}
            />
          </FormControl>
          <FormDescription>
            Adding your VIN improves valuation accuracy
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
