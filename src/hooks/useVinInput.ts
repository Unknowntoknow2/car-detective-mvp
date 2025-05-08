
import { useState, useEffect, ChangeEvent } from 'react';
import { validateVIN } from '@/utils/validation/vin-validation';

interface UseVinInputOptions {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

export function useVinInput({ initialValue = '', onValidChange }: UseVinInputOptions = {}) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (value) {
      const validation = validateVIN(value);
      setValidationError(validation.error || null);
      const newIsValid = validation.isValid;
      setIsValid(newIsValid);
      
      if (onValidChange) {
        onValidChange(newIsValid);
      }
    } else {
      setValidationError(touched ? 'VIN is required' : null);
      setIsValid(false);
      
      if (onValidChange) {
        onValidChange(false);
      }
    }
  }, [value, touched, onValidChange]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setValue(newValue);
    setTouched(true);
  };

  const reset = () => {
    setValue('');
    setTouched(false);
    setValidationError(null);
    setIsValid(false);
  };

  return {
    value,
    touched,
    validationError,
    isValid,
    handleInputChange,
    reset
  };
}
