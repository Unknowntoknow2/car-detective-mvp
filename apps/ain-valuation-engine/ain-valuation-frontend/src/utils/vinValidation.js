/**
 * Frontend VIN validation utility implementing ISO 3779 standard
 * Provides real-time validation for VIN input components
 */

// ISO 3779 character transliteration table
const TRANSLITERATION = {
  ...Object.fromEntries(Array.from({length: 10}, (_, i) => [i.toString(), i])),
  "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8,
  "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "P": 7, "R": 9,
  "S": 2, "T": 3, "U": 4, "V": 5, "W": 6, "X": 7, "Y": 8, "Z": 9
};

// Position weights for check digit calculation
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

// Valid VIN characters (excludes I, O, Q)
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Validates a VIN according to ISO 3779 standard
 * @param {string} vin - The VIN to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export function validateVIN(vin) {
  if (!vin || typeof vin !== "string") {
    return { valid: false, error: "VIN must be a string" };
  }
  
  const cleanVin = vin.trim().toUpperCase();
  
  if (cleanVin.length !== 17) {
    return { valid: false, error: "VIN must be exactly 17 characters" };
  }
  
  if (!VIN_REGEX.test(cleanVin)) {
    return { valid: false, error: "VIN contains invalid characters (excludes I, O, Q)" };
  }
  
  // Compute check digit
  let total = 0;
  for (let i = 0; i < 17; i++) {
    const char = cleanVin[i];
    const value = TRANSLITERATION[char];
    if (value === undefined) {
      return { valid: false, error: `Invalid character: ${char}` };
    }
    total += value * WEIGHTS[i];
  }
  
  const remainder = total % 11;
  const expectedCheckDigit = remainder === 10 ? "X" : remainder.toString();
  const actualCheckDigit = cleanVin[8];
  
  if (expectedCheckDigit !== actualCheckDigit) {
    return { 
      valid: false, 
      error: `Check digit mismatch (expected ${expectedCheckDigit}, got ${actualCheckDigit})` 
    };
  }
  
  return { valid: true };
}

/**
 * Extracts components from a valid VIN
 * @param {string} vin - A valid 17-character VIN
 * @returns {Object} VIN components
 */
export function extractVINComponents(vin) {
  if (!vin || vin.length !== 17) {
    return null;
  }
  
  const cleanVin = vin.trim().toUpperCase();
  
  return {
    worldManufacturerIdentifier: cleanVin.substring(0, 3),
    vehicleDescriptorSection: cleanVin.substring(3, 9),
    vehicleIdentifierSection: cleanVin.substring(9, 17),
    checkDigit: cleanVin[8],
    modelYear: cleanVin[9],
    plantCode: cleanVin[10],
    sequentialNumber: cleanVin.substring(11, 17)
  };
}

/**
 * Formats VIN input with proper spacing for readability
 * @param {string} vin - The VIN to format
 * @returns {string} Formatted VIN
 */
export function formatVIN(vin) {
  if (!vin) return "";
  
  const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, "").toUpperCase();
  
  // Add spaces for readability: WMI-VDS-VIS format
  if (cleanVin.length > 3 && cleanVin.length <= 9) {
    return `${cleanVin.substring(0, 3)} ${cleanVin.substring(3)}`;
  } else if (cleanVin.length > 9) {
    return `${cleanVin.substring(0, 3)} ${cleanVin.substring(3, 9)} ${cleanVin.substring(9)}`;
  }
  
  return cleanVin;
}

/**
 * Real-time validation for input fields
 * @param {string} value - Current input value
 * @returns {Object} Validation state
 */
export function validateVINInput(value) {
  const cleanValue = value.replace(/[^A-HJ-NPR-Z0-9]/gi, "").toUpperCase();
  
  if (cleanValue.length === 0) {
    return { isValid: null, error: "", suggestion: "Enter 17-character VIN" };
  }
  
  if (cleanValue.length < 17) {
    return { 
      isValid: false, 
      error: `${17 - cleanValue.length} more characters needed`,
      suggestion: "VIN must be exactly 17 characters"
    };
  }
  
  if (cleanValue.length === 17) {
    const validation = validateVIN(cleanValue);
    return {
      isValid: validation.valid,
      error: validation.error || "",
      suggestion: validation.valid ? "Valid VIN" : validation.error
    };
  }
  
  return { 
    isValid: false, 
    error: "VIN too long", 
    suggestion: "VIN must be exactly 17 characters" 
  };
}
