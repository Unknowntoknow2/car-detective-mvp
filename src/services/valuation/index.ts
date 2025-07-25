// Export all valuation services for easier imports

// Legacy exports
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

// New Professional Market Search Services - 100% Real Data Guarantee
export { BingSearchService } from './bingSearchService';
export type { BingSearchParams, BingSearchResult } from './bingSearchService';

export { OpenAIMarketAgent } from './openaiMarketAgent';
export type { OpenAIMarketSearchParams, OpenAIFunctionCall } from './openaiMarketAgent';

export { URLValidatorService } from './urlValidator';

export { MarketDataService } from './marketDataService';
export type { MarketSearchRequest, MarketSearchResult } from './marketDataService';