
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { validateVIN } from '@/utils/validation/vin-validation';
import { AlertCircle } from 'lucide-react';

interface VinInputFieldProps {
  form: any;
}

export const VinInputField: React.FC<VinInputFieldProps> = ({ form }) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const value = form.watch('vin');
  
  // Validate VIN whenever it changes
  useEffect(() => {
    if (value && value.trim() !== '') {
      const validation = validateVIN(value);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid VIN');
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [value]);
  
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="vin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VIN (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Enter VIN for more accurate valuation"
                  {...field}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    field.onChange(newValue);
                  }}
                  className={validationError ? 'border-red-300 pr-10' : ''}
                />
                {validationError && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                )}
              </div>
            </FormControl>
            {validationError && (
              <p className="text-sm text-red-500 mt-1">{validationError}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <p className="text-xs text-muted-foreground">
        Adding a VIN will improve the accuracy of your valuation
      </p>
    </div>
  );
};
