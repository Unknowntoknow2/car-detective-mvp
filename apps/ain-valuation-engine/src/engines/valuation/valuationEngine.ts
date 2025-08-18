// src/engines/valuation/valuationEngine.ts
import { EnrichedVehicleProfile } from '../../types/valuation';

/**
 * Estimates the market valuation of a vehicle based on its enriched profile.
 * This is the core logic where various factors (mileage, condition, market data, fuel economy)
 * are used to calculate the final value.
 *
 * extensive market data, machine learning models, and more sophisticated algorithms.
 */
export function estimateValuation(profile: EnrichedVehicleProfile): number {
  let estimatedValue = 0;

  // Start with a base value. In a real system, this would come from a database lookup
  // based on make, model, year, or a more complex initial model.
  if (profile.make === 'Toyota' && profile.model === 'Camry') {
    estimatedValue = 20000;
  } else if (profile.make === 'Honda' && profile.model === 'Civic') {
    estimatedValue = 18000;
  } else {
    estimatedValue = 15000; // Default base value
  }

  // Adjust for age
  if (profile.year) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - profile.year;
    estimatedValue = estimatedValue - (age * 750); // Deduct $750 per year of age
  }

  // Adjust for mileage
  if (profile.currentMileage !== undefined && profile.currentMileage !== null) {
    // A more sophisticated model might use non-linear adjustments or mileage tiers
    const mileageDeduction = (profile.currentMileage / 10000) * 150; // Deduct $150 per 10,000 miles
    estimatedValue = estimatedValue - mileageDeduction;
  }

  // Adjust for condition
  if (profile.condition) {
    switch (profile.condition.toLowerCase()) {
      case 'excellent':
        estimatedValue += 1500;
        break;
      case 'good':
        // No major adjustment from base
        break;
      case 'fair':
        estimatedValue -= 2000;
        break;
      case 'poor':
        estimatedValue -= 5000;
        break;
    }
  }

  if (profile.fuelEconomy?.combinedMpg) {
    if (profile.fuelEconomy.combinedMpg > 30) {
      estimatedValue += 300;
    } else if (profile.fuelEconomy.combinedMpg < 15) {
      estimatedValue -= 500;
    }
  }

  // Ensure the value doesn't go below a reasonable minimum
  return Math.round(Math.max(500, estimatedValue));
}