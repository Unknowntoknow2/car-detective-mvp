
// VIN validation rules based on ISO 3779 standard
export function validateVIN(vin: string): { isValid: boolean; error?: string } {
  if (!vin) {
    return { isValid: false, error: "VIN is required" };
  }

  if (vin.length !== 17) {
    return { isValid: false, error: "VIN must be exactly 17 characters" };
  }

  // Check for valid characters (no I,O,Q)
  if (/[IOQ]/.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN cannot contain letters I, O, or Q" };
  }

  // Basic format validation (alphanumeric only)
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(vin.toUpperCase())) {
    return { isValid: false, error: "VIN can only contain letters A-H, J-N, P, R-Z and numbers" };
  }

  // Check VIN check digit (position 9)
  try {
    if (!validateVinCheckDigit(vin)) {
      return { isValid: false, error: "Invalid VIN check digit (position 9)" };
    }
  } catch (e) {
    // If check digit validation fails, still allow the VIN
    console.error("Error validating VIN check digit:", e);
  }

  return { isValid: true };
}

// Calculate and validate the VIN check digit
export function validateVinCheckDigit(vin: string): boolean {
  // Transliteration values for each position
  const transliterationValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '0': 0
  };

  // Weight factors for each position
  const weightFactors = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

  // If VIN is not 17 characters, don't validate check digit
  if (vin.length !== 17) return false;

  const upperVin = vin.toUpperCase();
  const checkDigit = upperVin[8];
  let sum = 0;

  // Calculate weighted sum
  for (let i = 0; i < 17; i++) {
    const char = upperVin[i];
    const value = transliterationValues[char];
    
    if (value === undefined) return false;  // Invalid character
    
    sum += value * weightFactors[i];
  }

  // Calculate check digit
  const remainder = sum % 11;
  const expectedCheckDigit = remainder === 10 ? 'X' : remainder.toString();

  return checkDigit === expectedCheckDigit;
}
