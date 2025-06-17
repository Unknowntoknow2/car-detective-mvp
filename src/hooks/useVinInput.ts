
import { useState, useCallback } from 'react';

export const useVinInput = () => {
  const [vin, setVin] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setVin(cleanVin || null);
    
    if (cleanVin) {
      const valid = validateVin(cleanVin);
      setIsValid(valid);
      setError(valid ? null : 'Invalid VIN format');
    } else {
      setIsValid(false);
      setError(null);
    }
  }, [validateVin]);

  return {
    vin,
    isValid,
    error,
    handleVinChange,
    validateVin
  };
};
