
import { RulesEngineInput } from '../rules/types';

export const calculateDemandAdjustment = (input: RulesEngineInput): number => {
  // Default demand multiplier is 1.0 (no adjustment)
  let demandMultiplier = 1.0;
  
  // Apply zip code based adjustment if available
  if (input.zipCode) {
    // In a real implementation, this would lookup zip code specific demand data
    // For now, we'll use a simple mock implementation
    const firstDigit = parseInt(input.zipCode.charAt(0), 10);
    
    // Simple mock calculation based on first digit of zip code
    switch (firstDigit) {
      case 9: // West coast
        demandMultiplier = 1.05; // 5% premium for California, etc.
        break;
      case 1: // Northeast
        demandMultiplier = 1.03; // 3% premium for NY, MA, etc.
        break;
      case 3: // Southeast
        demandMultiplier = 0.98; // 2% discount for FL, GA, etc.
        break;
      case 6: // Midwest
        demandMultiplier = 0.97; // 3% discount for IL, MI, etc.
        break;
      default:
        demandMultiplier = 1.0; // No adjustment for other regions
    }
  }
  
  // Apply seasonal adjustments if sale date is provided
  if (input.saleDate) {
    const saleDate = new Date(input.saleDate);
    const month = saleDate.getMonth(); // 0-11
    
    // Adjust for seasonal factors
    if (input.bodyStyle?.toLowerCase().includes('convertible')) {
      // Convertibles sell better in spring/summer
      if (month >= 3 && month <= 8) { // April through September
        demandMultiplier *= 1.07; // 7% premium in warm months
      } else {
        demandMultiplier *= 0.95; // 5% discount in cold months
      }
    } else if (input.bodyStyle?.toLowerCase().includes('suv') || 
               input.bodyStyle?.toLowerCase().includes('truck')) {
      // SUVs and trucks sell better in fall/winter
      if (month >= 9 || month <= 2) { // October through March
        demandMultiplier *= 1.03; // 3% premium in cold months
      }
    }
  }
  
  // Apply make/model specific adjustment
  const isLuxury = ['bmw', 'audi', 'mercedes', 'lexus', 'porsche'].includes(input.make.toLowerCase());
  if (isLuxury) {
    demandMultiplier *= 1.02; // 2% premium for luxury brands
  }
  
  return demandMultiplier;
};
