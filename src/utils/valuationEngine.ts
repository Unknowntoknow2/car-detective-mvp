
import { calculateFinalValuation } from './valuation/calculateFinalValuation';
import { AICondition } from '@/types/photo';

// Re-export the function with compatibility with other parts of the codebase
export async function calculateFinalValuation(input: any, basePrice?: number, aiCondition?: AICondition) {
  // If basePrice isn't provided, estimate one based on the vehicle
  const estimatedBasePrice = basePrice || estimateBasePrice(input);
  
  // Call the actual implementation
  return await calculateFinalValuation(
    {
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage || 0,
      condition: input.condition || 'Good',
      zipCode: input.zipCode || input.zip || '90210',
      trim: input.trim,
      fuelType: input.fuelType,
      transmission: input.transmission,
      features: input.features,
      accidentCount: input.accidentCount,
      color: input.color,
      premiumFeatures: input.premiumFeatures
    },
    estimatedBasePrice,
    aiCondition || input.aiConditionData
  );
}

// Helper function to estimate a base price (simplified)
function estimateBasePrice(vehicle: any): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || 2020);
  
  // Start with a base value that depends on vehicle age
  let basePrice = 30000 - (age * 1500);
  
  // Adjust for luxury brands
  const luxuryBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Tesla', 'Porsche'];
  if (luxuryBrands.includes(vehicle.make)) {
    basePrice *= 1.5;
  }
  
  // Ensure a minimum value
  return Math.max(basePrice, 2000);
}
