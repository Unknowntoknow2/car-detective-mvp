
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { isValidVIN, validateVin } from '@/utils/validation/vin-validation';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';
import { AlertCircle } from 'lucide-react';

interface VinInputFieldProps {
  form: UseFormReturn<any>;
}

export const VinInputField: React.FC<VinInputFieldProps> = ({ form }) => {
  const [vinError, setVinError] = useState<string | null>(null);
  
  // Watch the VIN field for changes
  const vinValue = form.watch('vin');
  
  // Validate VIN whenever it changes
  useEffect(() => {
    if (!vinValue || vinValue.trim() === '') {
      setVinError(null);
      return;
    }
    
    const result = validateVin(vinValue);
    setVinError(result.isValid ? null : result.error || null);
  }, [vinValue]);

  return (
    <FormField
      control={form.control}
      name="vin"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vehicle Identification Number (VIN)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter 17-character VIN (optional)" 
              {...field} 
              maxLength={17} 
              className={vinError ? "border-destructive" : ""}
              onChange={(e) => {
                // Convert to uppercase for better user experience
                field.onChange(e.target.value.toUpperCase());
              }}
            />
          </FormControl>
          {vinError && (
            <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-sm">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{vinError}</span>
            </div>
          )}
          <VinInfoMessage />
        </FormItem>
      )}
    />
  );
};
