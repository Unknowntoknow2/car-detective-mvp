// File: src/engines/enrichment/index.ts

import { ValuationInputs, EnrichedVehicleProfile } from '../../types/valuation';
import {
  fetchFuelEconomyByYearMakeModel,
  fetchAvgFuelCostUSD,
} from '../../services/fuelEconomyService';

const DEFAULT_ANNUAL_MILEAGE = 13500; // miles/year

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
          console.warn(
            `Could not calculate annual fuel cost: Combined MPG missing for ${inputs.make} ${inputs.model}`
          );
        } else {
          console.warn(
            'Could not calculate annual fuel cost: Average fuel price missing.'
          );
        }
      }
    } catch (error) {
      console.error('Error during fuel economy enrichment:', error);
      enrichedProfile.fuelEconomy = undefined;
    }
  } else {
    console.warn('Skipping fuel economy enrichment: Missing year, make, or model.');
  }


  return enrichedProfile;
}
