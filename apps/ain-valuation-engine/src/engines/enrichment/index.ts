/**
 * Vehicle enrichment engine for enhancing basic vehicle data with additional insights.
 * 
 * This module provides data enrichment capabilities that augment basic vehicle
 * information with external data sources like fuel economy ratings, cost estimates,
 * and other relevant vehicle characteristics.
 * 
 * @module enrichment
 */

import { ValuationInputs, EnrichedVehicleProfile } from '../../types/valuation';
import {
  fetchFuelEconomyByYearMakeModel,
  fetchAvgFuelCostUSD,
} from '../../services/fuelEconomyService';
import logger from '../../utils/logger';

/** Default annual mileage assumption for fuel cost calculations (EPA average) */
const DEFAULT_ANNUAL_MILEAGE = 13500; // miles/year

/**
 * Enriches basic vehicle data with additional information from external sources.
 * 
 * This function takes basic vehicle identification data and enhances it with:
 * - EPA fuel economy ratings (city, highway, combined MPG)
 * - Fuel type information (gasoline, hybrid, electric, etc.)
 * - Annual fuel cost estimates based on current prices
 * - Other relevant vehicle characteristics
 * 
 * The enrichment process is designed to be resilient - if external data sources
 * are unavailable, the function returns the basic profile without enrichment.
 * 
 * @param {ValuationInputs} inputs - Basic vehicle data (VIN, year, make, model)
 * @returns {Promise<EnrichedVehicleProfile>} Enhanced vehicle profile with additional data
 * 
 * @throws {Error} When critical enrichment operations fail (logged but not propagated)
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   vin: '1HGBH41JXMN109186',
 *   year: 2020,
 *   make: 'Toyota',
 *   model: 'Camry',
 *   currentMileage: 45000
 * };
 * 
 * const enriched = await getEnrichedVehicleProfile(inputs);
 * console.log('Fuel Economy:', enriched.fuelEconomy);
 * console.log('Annual Fuel Cost:', enriched.fuelEconomy?.fuelCostPerYearUSD);
 * ```
 * 
 * @dataSources
 * - FuelEconomy.gov: EPA fuel economy ratings
 * - EIA: Current fuel price data
 * 
 * @errorHandling
 * - Graceful degradation when external APIs are unavailable
 * - Comprehensive logging for debugging enrichment failures
 * - Partial enrichment when some data sources succeed
 */
export async function getEnrichedVehicleProfile(
  inputs: ValuationInputs
): Promise<EnrichedVehicleProfile> {
  const enrichedProfile: EnrichedVehicleProfile = {
    vin: inputs.vin,
    year: inputs.year,
    make: inputs.make,
    model: inputs.model,
  };

  if (inputs.year && inputs.make && inputs.model) {
    try {
      const fuelEconomy = await fetchFuelEconomyByYearMakeModel(
        inputs.year,
        inputs.make,
        inputs.model
      );

      if (fuelEconomy) {
        enrichedProfile.fuelEconomy = fuelEconomy;

        const avgFuelPricePerGallon = await fetchAvgFuelCostUSD();

        if (fuelEconomy.combinedMpg && avgFuelPricePerGallon !== null) {
          const annualMileage = inputs.currentMileage || DEFAULT_ANNUAL_MILEAGE;
          const gallonsPerYear = annualMileage / fuelEconomy.combinedMpg;
          enrichedProfile.fuelEconomy.fuelCostPerYearUSD =
            gallonsPerYear * avgFuelPricePerGallon;
        } else if (!fuelEconomy.combinedMpg) {
          logger.warn(
            `Could not calculate annual fuel cost: Combined MPG missing for ${inputs.make} ${inputs.model}`
          );
        } else {
          logger.warn(
            'Could not calculate annual fuel cost: Average fuel price missing.'
          );
        }
      }
    } catch (error) {
      logger.error('Error during fuel economy enrichment:', error);
      enrichedProfile.fuelEconomy = undefined;
    }
  } else {
    logger.warn('Skipping fuel economy enrichment: Missing year, make, or model.');
  }


  return enrichedProfile;
}
