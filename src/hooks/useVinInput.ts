
import { useState, useCallback } from 'react';

interface UseVinInputProps {
  initialValue?: string;
  onValidChange?: (valid: boolean) => void;
}

export const useVinInput = (props?: UseVinInputProps) => {
  const [vin, setVin] = useState<string>(props?.initialValue || '');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateVin = useCallback((vinValue: string): boolean => {
    if (!vinValue) return false;
    
    // Basic VIN validation
    const cleanVin = vinValue.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    const isValidLength = cleanVin.length === 17;
    const hasValidChars = /^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVin);
    
    return isValidLength && hasValidChars;
  }, []);

  const handleVinChange = useCallback((newVin: string) => {
    const cleanVin = newVin?.trim() || '';
    setVin(cleanVin);
    setTouched(true);
    
    if (cleanVin) {
      const valid = validateVin(cleanVin);
      setIsValid(valid);
      const errorMsg = valid ? null : 'Invalid VIN format';
      setError(errorMsg);
      setValidationError(errorMsg);
      props?.onValidChange?.(valid);
    } else {
      setIsValid(false);
      setError(null);
      setValidationError(null);
      props?.onValidChange?.(false);
    }
  }, [validateVin, props]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleVinChange(e.target.value);
  }, [handleVinChange]);

  return {
    vin,
    isValid,
    error,
    validationError,
    touched,
    handleVinChange,
    handleInputChange,
    validateVin
  };
};
