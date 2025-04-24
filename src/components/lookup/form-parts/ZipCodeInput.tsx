
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface ZipCodeInputProps {
  zipCode: string;
  setZipCode: (zip: string) => void;
  isDisabled?: boolean;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  zipCode,
  setZipCode,
  isDisabled = false
}) => {
  const validateZipCode = (value: string) => {
    return /^\d{5}(-\d{4})?$/.test(value);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and hyphens, and limit to ZIP format
    if (/^[\d-]*$/.test(value) && value.length <= 10) {
      setZipCode(value);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="ZIP Code (e.g. 90210)"
        value={zipCode}
        onChange={handleZipChange}
        disabled={isDisabled}
        className="h-12 pl-10 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary"
        aria-invalid={zipCode.length > 0 && !validateZipCode(zipCode)}
      />
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      
      {zipCode.length > 0 && !validateZipCode(zipCode) && (
        <p className="text-xs text-destructive mt-1">
          Please enter a valid ZIP code (e.g. 90210 or 90210-1234)
        </p>
      )}
    </div>
  );
};
