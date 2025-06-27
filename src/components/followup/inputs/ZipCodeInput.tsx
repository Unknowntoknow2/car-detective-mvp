
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useZipValidation } from '@/hooks/useZipValidation';

interface ZipCodeInputProps {
  register: any;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ZipCodeInput({ 
  register,
  label = "ZIP Code", 
  required = false,
  className = ""
}: ZipCodeInputProps) {
  const [debouncedZip, setDebouncedZip] = React.useState('');
  const [shouldValidate, setShouldValidate] = React.useState(false);
  const { useZipQuery } = useZipValidation();
  const zipQuery = useZipQuery(debouncedZip);

  // Debounce logic
  React.useEffect(() => {
    if (!shouldValidate) return;
    
    const timer = setTimeout(() => {
      const zipInput = document.getElementById('zip_code') as HTMLInputElement;
      if (zipInput && zipInput.value.length === 5) {
        setDebouncedZip(zipInput.value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [shouldValidate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
    e.target.value = value;
    
    if (value.length === 5) {
      setShouldValidate(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length === 5) {
      setDebouncedZip(e.target.value);
      setShouldValidate(true);
    }
  };

  const isValid = debouncedZip.length === 5 && zipQuery.data?.isValid === true;
  const isLoading = zipQuery.isLoading && debouncedZip.length === 5;
  const hasError = debouncedZip.length === 5 && zipQuery.data?.isValid === false;

  return (
    <div className={className}>
      <Label htmlFor="zip_code" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative mt-1">
        <Input
          id="zip_code"
          type="text"
          placeholder="Enter ZIP code"
          className={`pr-10 ${
            hasError ? 'border-red-500 focus:border-red-500' : 
            isValid ? 'border-green-500 focus:border-green-500' : 
            'border-gray-300'
          }`}
          maxLength={5}
          {...register("zip", { required })}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-600" />
        )}
        {isValid && !isLoading && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {hasError && !isLoading && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {zipQuery.data?.error || 'Invalid ZIP code'}
        </p>
      )}
      {isValid && zipQuery.data?.location && (
        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {zipQuery.data.location['place name']}, {zipQuery.data.location['state abbreviation']}
        </p>
      )}
    </div>
  );
}
