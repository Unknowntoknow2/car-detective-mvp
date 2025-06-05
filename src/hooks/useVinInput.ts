
import { useEffect, useState } from "react";
import { isValidVIN, validateVin } from "@/utils/validation/vin-validation";

export interface UseVinInputOptions {
  initialValue?: string;
  onValidChange?: (isValid: boolean) => void;
}

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  // Handle input change
  const handleVinChange = (value: string) => {
    // Remove spaces and convert to uppercase
    const formattedVin = value.replace(/\s/g, '').toUpperCase();
    setVin(formattedVin);
    setTouched(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVinChange(e.target.value.toUpperCase());
  };

  return {
    vin,
    setVin: handleVinChange,
    isValid,
    validationError,
    handleVinChange,
    handleInputChange,
    isSubmitting,
    setIsSubmitting,
    touched
  };
}

export default useVinInput;
