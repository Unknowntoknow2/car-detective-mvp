// Advanced VIN validation utility (ISO 3779 compliant)
// Provides both basic and full (check digit) validation.

const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

// Transliteration table for ISO 3779 check digit calculation
const VIN_TRANSLITERATION = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
};

// Weighting factors for each VIN position
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Basic VIN validation (length, allowed characters).
 * @param {string} vin
 * @returns {boolean}
 */
export function validateVINBasic(vin) {
  return VIN_REGEX.test(vin);
}

/**
 * Full VIN validation (length, characters, and check digit).
 * Throws Error if invalid, or returns true.
 * @param {string} vin
 * @returns {boolean}
 */
export function validateVINFull(vin) {
  if (typeof vin !== 'string') throw new Error('VIN must be a string');
  if (vin.length !== 17) throw new Error('VIN must be exactly 17 characters');
  if (!VIN_REGEX.test(vin)) {
    throw new Error(
      'VIN contains invalid characters. Allowed: A-H, J-N, P, R-Z, 0-9 (excludes I, O, Q)'
    );
  }
  // Check digit validation (9th character)
  const checkDigit = vin[8];
  const calculated = calculateVinCheckDigit(vin);

  if (checkDigit !== calculated) {
    throw new Error(
      `VIN check digit mismatch (expected ${calculated}, got ${checkDigit})`
    );
  }
  return true;
}

/**
 * Calculate the ISO 3779 check digit for a VIN.
 * @param {string} vin
 * @returns {string}
 */
function calculateVinCheckDigit(vin) {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = VIN_TRANSLITERATION[char];
    const weight = VIN_WEIGHTS[i];
    if (typeof value === 'undefined') throw new Error(`Invalid character at position ${i + 1}`);
    sum += value * weight;
  }
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

/**
 * Optionally, add WMI (manufacturer code) validation.
 * Usage: isValidWMI(vin)
 */
const KNOWN_WMI = [
  // Add any you want to check, e.g. '1HG', 'JHM', 'WDB', 'WVW', '3VW', etc.
  // For full lists, see ISO 3780 or data sources online.
];

export function isValidWMI(vin) {
  if (vin.length < 3) return false;
  if (KNOWN_WMI.length === 0) return true; // No WMI list = skip
  const wmi = vin.slice(0, 3);
  return KNOWN_WMI.includes(wmi);
}
export { validateVINFull as validateVIN };

