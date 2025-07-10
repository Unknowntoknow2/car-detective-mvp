// Export all valuation services for easier imports
export { getDynamicMSRP } from './msrpLookupService';
export type { MSRPResult } from './msrpLookupService';

export { calculateAdvancedConfidence, getConfidenceBreakdown } from './confidenceEngine';

export { 
  validateVin, 
  validateMileage, 
  validateZipCode, 
  validateMarketListings, 
  validateFuelPrice 
} from './dataValidation';

export type { ValidationResult } from './dataValidation';