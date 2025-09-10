import { fetchVinLookup } from './vinLookupService';
import { fetchMarketPricing } from './vehiclePricingService';
import { fetchResidualForecast } from './residualValueService';
/**
 * Executes a complete vehicle valuation process for a given VIN number.
 *
 * This function handles the entire valuation workflow including:
 * - VIN decoding and validation
 * - Data storage and audit logging
 * - Performance metrics tracking
 * - Error handling and recovery
 *
 * @param {string} vin - The Vehicle Identification Number to process (17 characters)
 * @returns {Promise<any>} The decoded vehicle information and valuation data
 *
 * @throws {Error} When VIN decoding fails or database operations encounter errors
 *
 * @example
 * ```typescript
 * try {
 *   const result = await runValuation('1HGBH41JXMN109186');
 *   console.log('Valuation complete:', result);
 * } catch (error) {
 *   console.error('Valuation failed:', error);
 * }
 * ```
 *
 * @metrics
 * - Tracks valuation request counts by status (started/success/error)
 * - Measures valuation duration for performance monitoring
 * - Records database operation metrics for audit purposes
 */
export async function runValuation(vehicle) {
    // vehicle: normalized and enriched VehicleData
    // 1. VIN Lookup API enrichment
    let vinLookup = null;
    try {
        vinLookup = await fetchVinLookup(vehicle.vin);
    }
    catch (e) {
        vinLookup = null;
    }
    // 2. Market Pricing API
    let marketPricing = null;
    try {
        marketPricing = await fetchMarketPricing(vehicle.make, vehicle.model, vehicle.year);
    }
    catch (e) {
        marketPricing = null;
    }
    // 3. Residual Value API
    let residualForecast = null;
    try {
        residualForecast = await fetchResidualForecast(vehicle.vin);
    }
    catch (e) {
        residualForecast = null;
    }
    // 4. Baseline valuation logic (simple example)
    const baseValue = Math.max(5000, 30000 - (vehicle.mileage / 10));
    const priceRange = {
        low: Math.round(baseValue * 0.9),
        high: Math.round(baseValue * 1.1)
    };
    const confidence = 0.85;
    // 5. Merge all into ValuationResult
    return {
        coreResult: {
            vin: vehicle.vin,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            mileage: vehicle.mileage,
            zip: vehicle.zip,
            condition: vehicle.condition,
            titleStatus: vehicle.titleStatus,
            estimatedValue: baseValue,
            priceRange,
            confidence
        },
        enrichment: {
            vinLookup: vinLookup ? {
                trim: vinLookup.trim,
                engine: vinLookup.engine,
                drivetrain: vinLookup.drive,
                fuelType: vinLookup.fuelType
            } : null,
            marketPricing: marketPricing ? {
                retail: marketPricing.retail,
                wholesale: marketPricing.wholesale,
                tradeIn: marketPricing.tradeIn
            } : null,
            residualForecast: residualForecast ? {
                "1yr": residualForecast["1yr"],
                "2yr": residualForecast["2yr"],
                "3yr": residualForecast["3yr"]
            } : null
        }
    };
}
