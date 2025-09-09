
// Lookup Components - Consolidated Export

// Re-export everything from the consolidated lookup service
export * from '@/utils/lookupService';

// Core Lookup Components
export { UnifiedLookupTabs } from './UnifiedLookupTabs';
export { VehicleDetailsGrid } from './VehicleDetailsGrid';
export { default as VehicleInfoCard } from './VehicleInfoCard';
export { UnifiedPlateLookup } from './UnifiedPlateLookup';

// Scoring Components
export { BreakdownList } from './scoring/BreakdownList';
export { BreakdownItem } from './scoring/BreakdownItem';
export { VehicleScoreInfo } from './scoring/VehicleScoreInfo';
export { ConfidenceScore } from './scoring/ConfidenceScore';

// Legacy re-exports for backward compatibility
export { 
  lookupByVin as vinLookup,
  lookupByPlate as plateLookup
} from '@/utils/lookupService';
