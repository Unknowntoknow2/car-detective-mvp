
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ZipCodeInput } from '@/components/common/ZipCodeInput';
import { UseFormReturn } from 'react-hook-form';

interface ZipCodeFieldProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const ZipCodeField: React.FC<ZipCodeFieldProps> = ({
  form,
  name = 'zipCode',
  label = 'ZIP Code',
  required = false,
  placeholder = 'Enter ZIP code',
  disabled = false
}) => {
  const [isZipValid, setIsZipValid] = useState<boolean | undefined>(undefined);
  
  const handleZipChange = (value: string, isValid?: boolean) => {
    form.setValue(name, value, { shouldValidate: true, shouldDirty: true });
    setIsZipValid(isValid);
    
    // If the ZIP is invalid and we have a validation result, set an error
    if (isValid === false && value.length === 5) {
      form.setError(name, { 
        type: 'validate', 
        message: 'Invalid ZIP code' 
      });
    } else if (isValid === true) {
      form.clearErrors(name);
    }
  };
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <ZipCodeInput
              value={field.value || ''}
              onChange={handleZipChange}
              disabled={disabled || field.disabled}
              placeholder={placeholder}
              required={required}
              showValidation={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
