// Adjustment Helper Functions for Valuation Engine
import { getFuelCostByZip, computeFuelTypeAdjustment } from "./fuelCostService";

/**
 * Calculate depreciation adjustment based on vehicle year
 */
export function getDepreciationAdjustment(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  if (age <= 0) return 0; // Future model year
  if (age === 1) return -6000; // 20% depreciation first year
  
  // 10% per year after first year, diminishing returns after 10 years
  const baseDepreciation = 6000 + (age - 1) * 3000; // $3k per year after first
  const maxDepreciation = 18000; // Cap depreciation at $18k
  
  return -Math.min(baseDepreciation, maxDepreciation);
}

/**
 * Calculate mileage adjustment based on expected mileage
 */
export function getMileageAdjustment(mileage: number, basePrice?: number): number {
  if (!mileage) return 0;
  
  const averageMilesPerYear = 12000;
  const expectedMileage = averageMilesPerYear * 5; // Assume 5-year average vehicle
  const excessMileage = mileage - expectedMileage;
  
  if (excessMileage <= 0) {
    // Low mileage bonus (up to $2000)
    return Math.min(Math.abs(excessMileage) * 0.08, 2000);
  } else {
    // High mileage penalty
    return -Math.min(excessMileage * 0.12, 5000);
  }
}

/**
 * Calculate condition adjustment based on vehicle condition
 */
export function getConditionAdjustment(condition: string, basePrice?: number): number {
  const conditionMultipliers: Record<string, number> = {
    'excellent': 3000,
    'very good': 1500,
    'good': 0,
    'fair': -3000,
    'poor': -6000
  };
  
  const normalizedCondition = condition.toLowerCase();
  return conditionMultipliers[normalizedCondition] || 0;
}

/**
 * Calculate fuel cost adjustment using regional pricing
 */
export async function getFuelCostAdjustment(fuelType: string, zipCode: string): Promise<number> {
  try {
    const fuelData = await getFuelCostByZip(zipCode, fuelType);
    
    if (!fuelData) {
      console.warn('No fuel data available, using fallback adjustment');
      return getFallbackFuelAdjustment(fuelType);
    }
    
    const baseValue = 25000; // Assume average base value for percentage calculation
    const adjustment = computeFuelTypeAdjustment(
      fuelType,
      baseValue,
      fuelData.cost_per_gallon,
      zipCode
    );
    
    return adjustment.adjustment;
  } catch (error) {
    console.error('Error calculating fuel cost adjustment:', error);
    return getFallbackFuelAdjustment(fuelType);
  }
}

function getFallbackFuelAdjustment(fuelType: string): number {
  const fallbackAdjustments: Record<string, number> = {
    'electric': 2000,
    'hybrid': 1200,
    'diesel': 500,
    'premium': -300,
    'gasoline': 0
  };
  
  return fallbackAdjustments[fuelType.toLowerCase()] || 0;
}