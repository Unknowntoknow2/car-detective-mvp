
import { useState, useEffect } from 'react';
import { VinSchema } from '@/utils/validation/schemas';

interface UseVinInputProps {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

export function useVinInput({ initialValue = '', onValidChange }: UseVinInputProps = {}) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  useEffect(() => {
    if (value && touched) {
      try {
        VinSchema.parse(value);
        setValidationError(null);
        onValidChange?.(true);
      } catch (err) {
        if (err instanceof Error) {
          setValidationError(err.message);
          onValidChange?.(false);
        }
      }
    } else {
      onValidChange?.(false);
    }
  }, [value, touched, onValidChange]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setTouched(true);
    setValue(newValue);
  };
  
  return {
    value,
    setValue,
    touched,
    setTouched,
    validationError,
    handleInputChange,
    isValid: value && !validationError
  };
}
