export class CarDetectiveValidator {
  
  validateVehicleData(data: any): ValidationResult {
    const errors: string[] = [];
    
    // Basic validation
    if (!data.make) errors.push('Make is required');
    if (!data.model) errors.push('Model is required');
    if (!data.year) errors.push('Year is required');
    
    // Year validation
    const currentYear = new Date().getFullYear();
    if (data.year < 1900 || data.year > currentYear + 1) {
      errors.push('Year must be between 1900 and current year');
    }
    
    // Mileage validation
    if (data.mileage && (data.mileage < 0 || data.mileage > 999999)) {
      errors.push('Mileage must be between 0 and 999,999');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
