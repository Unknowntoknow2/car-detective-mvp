
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  const [isValidatingZip, setIsValidatingZip] = useState(false);
  const [isZipValid, setIsZipValid] = useState<boolean | null>(null);

  const validateZipCode = async (zip: string) => {
    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
      setIsZipValid(false);
      return false;
    }
    
    try {
      setIsValidatingZip(true);
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      const isValid = response.ok;
      setIsZipValid(isValid);
      
      if (!isValid) {
        toast.error("Invalid ZIP code. Please enter a valid US ZIP code.");
      }
      
      return isValid;
    } catch (error) {
      console.error("ZIP validation error:", error);
      setIsZipValid(false);
      toast.error("Failed to validate ZIP code. Please try again.");
      return false;
    } finally {
      setIsValidatingZip(false);
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setZipCode(value.slice(0, 5));
    if (value.length !== 5) {
      setIsZipValid(null);
    }
  };

  return (
    <Input 
      placeholder="ZIP Code (optional)" 
      value={zipCode}
      onChange={handleZipChange}
      onBlur={() => zipCode.length === 5 && validateZipCode(zipCode)}
      maxLength={5}
      disabled={isDisabled || isValidatingZip}
      className={`${isZipValid === true ? "border-green-500" : 
                   isZipValid === false ? "border-red-500" : ""}`}
    />
  );
};
