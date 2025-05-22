
import { calculateAdjustments } from '../rulesEngine';
import { RulesEngineInput } from '../rules/types';

/**
 * Calculate market demand adjustments
 */
export async function calculateMarketDemandAdjustments(input: RulesEngineInput) {
  // Example implementation
  const adjustments = await calculateAdjustments(input);
  
  return {
    adjustments,
    totalAdjustment: adjustments.reduce((sum, adj) => sum + adj.impact, 0)
  };
}

/**
 * Get zip code market impact
 */
export function getZipCodeMarketImpact(zipCode: string): number {
  // Example implementation - would be data-driven in real app
  const firstDigit = parseInt(zipCode.charAt(0));
  
  // Simple example multipliers by zip code first digit
  const multipliers = [0.02, 0.01, 0, -0.01, -0.02, 0, 0.01, 0.02, 0.03, 0.04];
  
  return multipliers[firstDigit] || 0;
}
