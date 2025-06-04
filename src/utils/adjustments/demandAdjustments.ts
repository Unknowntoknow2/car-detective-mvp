<<<<<<< HEAD

import { calculateAdjustments } from '../rulesEngine';
import { RulesEngineInput } from '../rules/types';
=======
import { RulesEngineInput } from "../rules/types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Calculate market demand adjustments
 */
<<<<<<< HEAD
export async function calculateMarketDemandAdjustments(input: RulesEngineInput) {
  // Example implementation
  const adjustments = await calculateAdjustments(input);
  
  return {
    adjustments,
    totalAdjustment: adjustments.reduce((sum, adj) => sum + adj.impact, 0)
=======
export function calculateMarketDemand(
  input: EnhancedRulesEngineInput,
): AdjustmentResult {
  let impactPercentage = 0;
  let explanation = "Based on current market conditions";

  // Check if the vehicle is in high demand season
  const currentMonth = new Date().getMonth() + 1; // 1-12
  if (input.saleDate) {
    const saleMonth = new Date(input.saleDate).getMonth() + 1;
    // Spring and summer months typically have higher demand
    if (saleMonth >= 3 && saleMonth <= 8) {
      impactPercentage += 2; // 2% positive adjustment for spring/summer sales
    }
  }

  // Body style demand (SUVs and trucks typically have higher demand)
  if (input.bodyStyle) {
    if (input.bodyStyle.toLowerCase().includes("suv")) {
      impactPercentage += 3;
      explanation += ", SUVs have strong market demand";
    } else if (input.bodyStyle.toLowerCase().includes("truck")) {
      impactPercentage += 2;
      explanation += ", trucks have above-average market demand";
    } else if (input.bodyStyle.toLowerCase().includes("sedan")) {
      impactPercentage -= 1;
      explanation += ", sedans have below-average market demand";
    }
  }

  // Calculate actual impact amount
  const impact = input.baseValue * (impactPercentage / 100);

  return {
    factor: "Market Demand",
    impact: Math.round(impact),
    description: explanation,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
