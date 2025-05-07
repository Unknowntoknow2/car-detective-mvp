
import { useState, useEffect, ChangeEvent } from 'react';
import { CarDetectiveValidator } from '@/utils/validation/CarDetectiveValidator';

interface UseVinInputProps {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

interface UseVinInputResult {
  value: string;
  touched: boolean;
  validationError: string | null;
  isValid: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetVin: () => void;
}

export function useVinInput({ 
  initialValue = '', 
  onValidChange 
}: UseVinInputProps = {}): UseVinInputResult {
  const [value, setValue] = useState<string>(initialValue);
  const [touched, setTouched] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  const validateVin = (vin: string) => {
    if (!vin) {
      setValidationError('VIN is required');
      setIsValid(false);
      return false;
    }
    
    if (!CarDetectiveValidator.isValidVIN(vin)) {
      setValidationError('VIN must be 17 characters, alphanumeric, and cannot contain I, O, or Q');
      setIsValid(false);
      return false;
    }
    
    setValidationError(null);
    setIsValid(true);
    return true;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setValue(newValue);
    setTouched(true);
    validateVin(newValue);
  };

  const resetVin = () => {
    setValue('');
    setTouched(false);
    setValidationError(null);
    setIsValid(false);
  };

  // Validate initial value
  useEffect(() => {
    if (initialValue) {
      validateVin(initialValue);
    }
  }, [initialValue]);

  // Notify parent component when validation status changes
  useEffect(() => {
    if (onValidChange) {
      onValidChange(isValid);
    }
  }, [isValid, onValidChange]);

  return {
    value,
    touched,
    validationError,
    isValid,
    handleInputChange,
    resetVin
  };
}
