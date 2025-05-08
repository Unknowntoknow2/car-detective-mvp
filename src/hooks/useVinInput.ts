
import { useState, useEffect, ChangeEvent } from 'react';
import { isValidVIN } from '@/utils/validation/vin-validation';

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
    
    if (!isValidVIN(vin)) {
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
    
    const isInputValid = validateVin(newValue);
    if (onValidChange) {
      onValidChange(isInputValid);
    }
  };

  const resetVin = () => {
    setValue('');
    setTouched(false);
    setValidationError(null);
    setIsValid(false);
    if (onValidChange) {
      onValidChange(false);
    }
  };

  useEffect(() => {
    if (initialValue) {
      const isInputValid = validateVin(initialValue);
      if (onValidChange) {
        onValidChange(isInputValid);
      }
    }
  }, [initialValue, onValidChange]);

  return {
    value,
    touched,
    validationError,
    isValid,
    handleInputChange,
    resetVin
  };
}
