// Adjustment Helper Functions for Valuation Engine
import { getFuelCostByZip, computeFuelTypeAdjustment } from "./fuelCostService";

/**
 * Calculate depreciation adjustment based on vehicle year
 */
export function getDepreciationAdjustment(year: number, make?: string, fuelType?: string): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  if (age <= 0) return 0; // Future model year
  
  // Brand reliability factor (Toyota/Honda depreciate slower)
  const reliableBrands = ['toyota', 'honda', 'lexus', 'acura'];
  const brandMultiplier = reliableBrands.includes(make?.toLowerCase() || '') ? 0.8 : 1.0;
  
  // Hybrid/Electric premium retention
  const fuelMultiplier = fuelType?.toLowerCase().includes('hybrid') ? 0.9 : 
                        fuelType?.toLowerCase().includes('electric') ? 0.85 : 1.0;
  
  // More conservative depreciation curve
  let depreciationRate;
  if (age === 1) depreciationRate = 0.15; // 15% first year (reduced from 20%)
  else if (age <= 3) depreciationRate = 0.08; // 8% per year years 2-3 (reduced from 15%)
  else if (age <= 7) depreciationRate = 0.06; // 6% per year years 4-7 (reduced from 10%)
  else depreciationRate = 0.04; // 4% per year after 7 years (reduced from 5%)
  
  // Calculate total depreciation with diminishing returns
  const totalDepreciation = age === 1 ? 0.15 : 
    0.15 + Math.min(age - 1, 2) * 0.08 + Math.max(0, Math.min(age - 3, 4)) * 0.06 + Math.max(0, age - 7) * 0.04;
  
  // Apply brand and fuel type multipliers, cap at 65% instead of 85%
  const adjustedDepreciation = Math.min(totalDepreciation * brandMultiplier * fuelMultiplier, 0.65);
  
  // Return as negative dollar amount (assuming $30k base for calculation)
  return Math.round(-30000 * adjustedDepreciation);
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