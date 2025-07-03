// Main export for ValuationIntegrationService
export { ValuationIntegrationService } from './services/ValuationIntegrationService';
export { useValuationIntegration } from './hooks/useValuationIntegration';

// Ensure all core types are exported
export type { DecodedVehicleInfo, UnifiedVehicleData } from './types/vehicle';
export type { ValuationResult, LegacyValuationResult } from './types/valuation';