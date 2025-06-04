<<<<<<< HEAD

import { useState, useCallback, ChangeEvent } from 'react';
=======
import { useEffect, useState } from "react";
import { isValidVIN, validateVin } from "@/utils/validation/vin-validation";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface VinInputOptions {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

<<<<<<< HEAD
export const useVinInput = (options?: VinInputOptions) => {
  const [vin, setVin] = useState<string | null>(options?.initialValue || '');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
=======
export function useVinInput(options?: UseVinInputOptions | string) {
  // Handle backward compatibility for when string was passed directly
  const initialValue = typeof options === "string"
    ? options
    : options?.initialValue || "";

  const onValidChange = typeof options === "object"
    ? options.onValidChange
    : undefined;

  const [vin, setVin] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

<<<<<<< HEAD
  // VIN validation rules
  const validateVin = useCallback((value: string): boolean => {
    // Basic VIN validation (17 alphanumeric characters, excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z0-9]{17}$/;
    return vinRegex.test(value);
  }, []);
=======
  useEffect(() => {
    if (vin) {
      const validationResult = validateVin(vin);
      setIsValid(validationResult.isValid);
      setValidationError(
        validationResult.isValid ? null : validationResult.error,
      );

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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  // Handle input change
  const handleVinChange = useCallback((value: string) => {
    // Remove spaces and convert to uppercase
    const formattedVin = value.replace(/\s/g, '').toUpperCase();
    setVin(formattedVin);
    setTouched(true);
<<<<<<< HEAD
    
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
=======
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVinChange(e.target.value.toUpperCase());
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
