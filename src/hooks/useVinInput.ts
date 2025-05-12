
import { useState, useEffect } from 'react';
import { validateVin, isValidVIN } from '@/utils/validation/vin-validation';

type UseVinInputOptions = {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
};

export function useVinInput(options?: UseVinInputOptions | string) {
  // Handle backward compatibility for when string was passed directly
  const initialValue = typeof options === 'string' 
    ? options 
    : options?.initialValue || '';
  
  const onValidChange = typeof options === 'object' 
    ? options.onValidChange 
    : undefined;

  const [vin, setVin] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (vin) {
      const validationResult = validateVin(vin);
      setIsValid(validationResult.isValid);
      setValidationError(validationResult.isValid ? null : validationResult.error);
      
      if (onValidChange) {
        onValidChange(validationResult.isValid);
      }
    } else {
      setIsValid(false);
      setValidationError(null);
      
      if (onValidChange) {
        onValidChange(false);
      }
    }
  }, [vin, onValidChange]);

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
    setTouched(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVinChange(e.target.value.toUpperCase());
  };

  return {
    vin,
    value: vin, // Add for compatibility
    isValid,
    touched,
    validationError,
    handleVinChange,
    handleInputChange,
  };
}
