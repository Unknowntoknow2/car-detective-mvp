
import { validateVIN, isValidVIN, validateVinCheckDigit } from './vin-validation-helpers';

export { validateVIN, isValidVIN, validateVinCheckDigit };

export function enhancedVinValidation(vin: string) {
  const result = validateVIN(vin);
  return {
    ...result,
    timestamp: new Date().toISOString(),
    source: 'enhanced-validation'
  };
}
