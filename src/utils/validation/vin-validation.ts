
export function isValidVIN(vin: string): boolean {
  // Basic VIN validation - 17 characters, alphanumeric except for I, O, Q
  if (!vin || vin.length !== 17) {
    return false;
  }
  
  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(vin)) {
    return false;
  }
  
  // Check for valid alphanumeric characters
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

export function validateVin(vin: string): { isValid: boolean; error: string | null } {
  if (!vin) {
    return { 
      isValid: false, 
      error: null 
    };
  }
  
  if (vin.length !== 17) {
    return { 
      isValid: false, 
      error: "VIN must be exactly 17 characters" 
    };
  }
  
  if (/[IOQ]/.test(vin)) {
    return { 
      isValid: false, 
      error: "VIN cannot contain letters I, O, or Q" 
    };
  }
  
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { 
      isValid: false, 
      error: "VIN can only contain alphanumeric characters" 
    };
  }
  
  return { isValid: true, error: null };
}
