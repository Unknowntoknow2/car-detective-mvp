
// State-specific license plate format rules
export type PlateFormat = {
  regex: RegExp;
  description: string;
};

export type StateFormats = {
  [stateCode: string]: PlateFormat;
};

export const STATE_PLATE_FORMATS: StateFormats = {
  // These are simplified examples - real implementations would be more complex
  AL: { 
    regex: /^[A-Z0-9]{1,7}$/, 
    description: 'Alabama plates are 1-7 alphanumeric characters' 
  },
  AK: { 
    regex: /^[A-Z0-9]{3,7}$/, 
    description: 'Alaska plates are 3-7 alphanumeric characters' 
  },
  AZ: { 
    regex: /^[A-Z]{3}[0-9]{4}$/, 
    description: 'Arizona standard plates are 3 letters followed by 4 numbers' 
  },
  CA: { 
    regex: /^[0-9A-Z]{1,7}$/, 
    description: 'California plates are 1-7 alphanumeric characters' 
  },
  CO: { 
    regex: /^[A-Z]{3}-[0-9]{3}$/, 
    description: 'Colorado plates format: ABC-123' 
  },
  CT: { 
    regex: /^[A-Z0-9]{1,8}$/, 
    description: 'Connecticut plates are 1-8 alphanumeric characters' 
  },
  FL: { 
    regex: /^[A-Z0-9]{1,7}$/, 
    description: 'Florida plates are 1-7 alphanumeric characters' 
  },
  GA: { 
    regex: /^[A-Z0-9]{1,7}$/, 
    description: 'Georgia plates are 1-7 alphanumeric characters' 
  },
  HI: { 
    regex: /^[A-Z0-9]{1,7}$/, 
    description: 'Hawaii plates are 1-7 alphanumeric characters' 
  },
  // Add more states as needed...
  
  // Default format for states not specifically defined
  DEFAULT: { 
    regex: /^[A-Z0-9-]{1,8}$/, 
    description: 'License plate should be 1-8 alphanumeric characters or hyphens' 
  }
};

/**
 * Gets the plate format for a specific state
 * @param stateCode Two-letter state code
 * @returns Plate format rules for the state
 */
export function getStateFormat(stateCode: string): PlateFormat {
  return STATE_PLATE_FORMATS[stateCode.toUpperCase()] || STATE_PLATE_FORMATS.DEFAULT;
}

/**
 * Validates a license plate for a specific state
 * @param plate License plate to validate
 * @param stateCode Two-letter state code
 * @returns Object with validation result and error message
 */
export function validateStatePlate(plate: string, stateCode: string): { 
  valid: boolean; 
  error?: string;
} {
  if (!plate) {
    return { valid: false, error: 'License plate is required' };
  }
  
  if (!stateCode || stateCode.length !== 2) {
    return { valid: false, error: 'Valid state code is required' };
  }
  
  const format = getStateFormat(stateCode);
  const cleanPlate = plate.replace(/\s/g, '').toUpperCase();
  
  if (!format.regex.test(cleanPlate)) {
    return { 
      valid: false, 
      error: `Invalid format for ${stateCode}: ${format.description}` 
    };
  }
  
  return { valid: true };
}
