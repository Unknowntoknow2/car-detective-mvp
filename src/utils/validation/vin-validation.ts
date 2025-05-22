
// If the current implementation returns just a boolean, we should update it to return an object
// with isValid and message properties, or make sure the calling code knows it returns a boolean

export const isValidVIN = (vin: string): boolean => {
  // Basic VIN validation: 17 alphanumeric characters, excluding I, O, Q
  if (!vin) return false;
  
  // Check length
  if (vin.length !== 17) return false;
  
  // Check for invalid characters (I, O, Q)
  const invalidChars = ['I', 'O', 'Q'];
  for (const char of invalidChars) {
    if (vin.includes(char)) return false;
  }
  
  // Check that all characters are alphanumeric
  const alphanumericRegex = /^[A-HJ-NPR-Z0-9]+$/;
  return alphanumericRegex.test(vin);
};

// If needed by other components, we can also provide a more detailed validation
export const validateVIN = (vin: string): { isValid: boolean; message: string } => {
  if (!vin) {
    return { isValid: false, message: 'VIN is required' };
  }
  
  if (vin.length !== 17) {
    return { isValid: false, message: 'VIN must be exactly 17 characters' };
  }
  
  const invalidChars = ['I', 'O', 'Q'];
  for (const char of invalidChars) {
    if (vin.includes(char)) {
      return { isValid: false, message: `VIN cannot contain the character '${char}'` };
    }
  }
  
  const alphanumericRegex = /^[A-HJ-NPR-Z0-9]+$/;
  if (!alphanumericRegex.test(vin)) {
    return { isValid: false, message: 'VIN can only contain letters (except I, O, Q) and numbers' };
  }
  
  return { isValid: true, message: '' };
};
