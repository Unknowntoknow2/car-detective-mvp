import { useState, useEffect } from 'react';
import { validateVin, isValidVIN } from '@/utils/validation/vin-validation';

export function useVinInput(initialValue: string = '') {
  const [vin, setVin] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (vin) {
      setIsValid(isValidVIN(vin));
    } else {
      setIsValid(false);
    }
  }, [vin]);

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
  };

  return {
    vin,
    isValid,
    handleVinChange,
  };
}
