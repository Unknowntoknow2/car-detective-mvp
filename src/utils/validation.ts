
// Vehicle validation utilities

export const validateVin = (vin: string): string | null => {
  if (!vin) return 'VIN is required';
  if (vin.length !== 17) return 'VIN must be exactly 17 characters';
  
  // Additional VIN validation logic
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
  if (!vinRegex.test(vin)) {
    return 'VIN contains invalid characters (I, O, Q are not used in VINs)';
  }
  
  return null;
};

export const validatePlate = (plate: string): string | undefined => {
  if (!plate) return 'License plate is required';
  
  // Basic plate validation
  if (plate.length < 2) {
    return 'License plate must be at least 2 characters';
  }
  
  if (plate.length > 8) {
    return 'License plate cannot exceed 8 characters';
  }
  
  return undefined;
};

export const validateMileage = (mileage: string | number): string | null => {
  if (typeof mileage === 'string' && !mileage) return 'Mileage is required';
  
  const mileageNum = Number(mileage);
  if (isNaN(mileageNum)) return 'Mileage must be a number';
  if (mileageNum < 0) return 'Mileage cannot be negative';
  if (mileageNum > 1000000) return 'Mileage value is too high';
  
  return null;
};

export const validateZipCode = (zipCode: string): string | undefined => {
  if (!zipCode) return 'ZIP code is required';
  
  const zipRegex = /^\d{5}$/;
  if (!zipRegex.test(zipCode)) {
    return 'ZIP code must be 5 digits';
  }
  
  return undefined;
};
