
import { useState, useCallback } from 'react';

export const useVinInput = () => {
  const [vin, setVin] = useState<string | null>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    
    if (formattedVin.length === 0) {
      setError(null);
      setIsValid(false);
      return;
    }
    
    if (formattedVin.length !== 17) {
      setError('VIN must be 17 characters');
      setIsValid(false);
      return;
    }
    
    if (!validateVin(formattedVin)) {
      setError('Invalid VIN format');
      setIsValid(false);
      return;
    }
    
    setError(null);
    setIsValid(true);
  }, [validateVin]);

  // Safe setter for TypeScript compatibility
  const safeSetVin = (value: string | null | undefined) => {
    if (value === undefined) {
      setVin('');
    } else {
      setVin(value);
    }
  };

  return {
    vin,
    setVin: safeSetVin,
    isValid,
    error,
    handleVinChange,
    isSubmitting,
    setIsSubmitting,
    validateVin
  };
};

export default useVinInput;
