/**
 * Unified Types Index
 * 
 * Central export for all type definitions.
 * This replaces fragmented type imports from legacy apps/ain-valuation-engine
 */

// Vehicle Data Types (Primary) - Our new unified types
export * from './vehicleData';

// Market and Valuation Types
export * from './valuationTypes';
export * from './marketListing';
export * from './listing';
export * from './listings';

// Lookup and Decoding (avoiding conflicts)
export type { LookupFormData, LookupMethod, LookupTier, VehicleLookupResult } from './vehicle-lookup';
export * from './vehicle-decode';
export * from './vpic';

// UI and Components
export * from './ui-components';
export * from './section-header';
export * from './steps';

// Authentication and Users (avoiding conflicts)
export type { User, UserDetails } from './auth';
export * from './profile';

// Business Logic
export * from './dealer';
export * from './dealerVehicle';
export * from './premium-valuation';
export * from './auction';
export * from './auctionIntelligence';

/**
 * Legacy compatibility
 * @deprecated Import from specific modules instead
 */
export type { DecodedVehicleInfo, Vehicle } from './vehicleData';