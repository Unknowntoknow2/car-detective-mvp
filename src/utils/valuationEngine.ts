
import { AICondition } from '@/types/photo';
import { AdjustmentBreakdown } from '@/types/valuation';
import { FinalValuationResult } from './valuation/types';

// Re-export the function with compatibility with other parts of the codebase
export async function calculateFinalValuation(input: any, basePrice?: number, aiCondition?: AICondition) {
  // If basePrice isn't provided, estimate one based on the vehicle
  const estimatedBasePrice = basePrice || estimateBasePrice(input);
  
  // Mock implementation for now
  const adjustments = generateMockAdjustments(input);
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.value, 0);
  const estimatedValue = estimatedBasePrice + totalAdjustment;
  const confidenceScore = calculateConfidenceScore(input, aiCondition);
  const priceRange = calculatePriceRange(estimatedValue, confidenceScore);
  
  return {
    basePrice: estimatedBasePrice,
    estimatedValue,
    adjustments,
    confidenceScore,
    priceRange,
    aiSummary: aiCondition?.aiSummary
  };
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

// Generate mock adjustments
function generateMockAdjustments(input: any): AdjustmentBreakdown[] {
  return [
    {
      name: 'Mileage',
      factor: 'Mileage',
      value: -1000,
      impact: -1000,
      description: 'Based on vehicle mileage',
      percentAdjustment: -3.5
    },
    {
      name: 'Condition',
      factor: 'Condition',
      value: 800,
      impact: 800,
      description: 'Based on reported condition',
      percentAdjustment: 2.5
    },
    {
      name: 'Market Demand',
      factor: 'Market Demand',
      value: 1200,
      impact: 1200,
      description: 'Current market demand in your area',
      percentAdjustment: 4.0
    }
  ];
}

// Calculate confidence score
function calculateConfidenceScore(input: any, aiCondition?: AICondition): number {
  // Base confidence
  let score = 80;
  
  // Add confidence from AI condition if available
  if (aiCondition) {
    score += (aiCondition.confidenceScore / 100) * 10;
  }
  
  // Cap at 95
  return Math.min(score, 95);
}

// Calculate price range
function calculatePriceRange(estimatedValue: number, confidenceScore: number): [number, number] {
  const margin = ((100 - confidenceScore) / 100) * 0.15 * estimatedValue;
  return [
    Math.floor(estimatedValue - margin),
    Math.ceil(estimatedValue + margin)
  ];
}
