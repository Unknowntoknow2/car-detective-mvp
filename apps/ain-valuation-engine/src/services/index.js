/**
 * VIN Services - Unified Export
 * Provides all VIN-related functionality through a single import
 */
// Main unified decoder
export { decodeVin, VINDecodeError, extractLegacyVehicleInfo, getVinField, isVinDecodeSuccessful } from './unifiedVinDecoder';
// Validation utilities
export { validateVIN, isValidVinFormat, parseVinComponents, normalizeVin } from './vinValidation';
// Import functions for re-export
import { decodeVin } from './unifiedVinDecoder';
import { validateVIN, isValidVinFormat, normalizeVin } from './vinValidation';
// Re-export common patterns for convenience
export const VinServices = {
    decode: decodeVin,
    validate: validateVIN,
    isValidFormat: isValidVinFormat,
    normalize: normalizeVin
};
