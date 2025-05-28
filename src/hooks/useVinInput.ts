
import { useState, useCallback, ChangeEvent } from 'react';

export interface VinInputOptions {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

export const useVinInput = (options?: VinInputOptions) => {
  const [vin, setVin] = useState<string | null>(options?.initialValue || '');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  // VIN validation rules
  const validateVin = useCallback((value: string): boolean => {
    // Basic VIN validation (17 alphanumeric characters, excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z0-9]{17}$/;
    return vinRegex.test(value);
  }, []);

  // Handle input change
  const handleVinChange = useCallback((value: string) => {
    // Remove spaces and convert to uppercase
    const formattedVin = value.replace(/\s/g, '').toUpperCase();
    setVin(formattedVin);
    setTouched(true);
    
    if (formattedVin.length === 0) {
      setError(null);
      setValidationError(null);
      setIsValid(false);
      if (options?.onValidChange) options.onValidChange(false);
      return;
    }
    
    if (formattedVin.length !== 17) {
      setError('VIN must be 17 characters');
      setValidationError('VIN must be 17 characters');
      setIsValid(false);
      if (options?.onValidChange) options.onValidChange(false);
      return;
    }
    
    if (!validateVin(formattedVin)) {
      setError('Invalid VIN format');
      setValidationError('Invalid VIN format');
      setIsValid(false);
      if (options?.onValidChange) options.onValidChange(false);
      return;
    }
    
    setError(null);
    setValidationError(null);
    setIsValid(true);
    if (options?.onValidChange) options.onValidChange(true);
  }, [validateVin, options]);

  // Handle form input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleVinChange(e.target.value);
  }, [handleVinChange]);

  // Safe setter for TypeScript compatibility
  const safeSetVin = (value: string | null | undefined) => {
    if (value === undefined || value === null) {
      setVin('');
      setTouched(true);
      setIsValid(false);
    } else {
      setVin(value);
      handleVinChange(value);
    }
  };

  return {
    vin,
    setVin: safeSetVin,
    isValid,
    error,
    validationError,
    handleVinChange,
    handleInputChange,
    isSubmitting,
    setIsSubmitting,
    validateVin,
    touched
  };
};

export default useVinInput;
