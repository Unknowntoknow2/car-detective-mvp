
import { RulesEngineInput } from '../rules/types';

interface AdjustmentResult {
  factor: string;
  impact: number;
  description: string;
}

export interface EnhancedRulesEngineInput extends RulesEngineInput {
  saleDate?: string;
  bodyStyle?: string;
}

/**
 * Calculate the market demand adjustment based on the vehicle data
 * @param input Data for the rules engine evaluation
 * @returns Adjustment result
 */
export function calculateMarketDemand(input: EnhancedRulesEngineInput): AdjustmentResult {
  let impactPercentage = 0;
  let explanation = 'Based on current market conditions';

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
    if (input.bodyStyle.toLowerCase().includes('suv')) {
      impactPercentage += 3;
      explanation += ', SUVs have strong market demand';
    } else if (input.bodyStyle.toLowerCase().includes('truck')) {
      impactPercentage += 2;
      explanation += ', trucks have above-average market demand';
    } else if (input.bodyStyle.toLowerCase().includes('sedan')) {
      impactPercentage -= 1;
      explanation += ', sedans have below-average market demand';
    }
  }

  // Calculate actual impact amount
  const impact = input.baseValue * (impactPercentage / 100);

  return {
    factor: 'Market Demand',
    impact: Math.round(impact),
    description: explanation
  };
}

// Additional market demand adjustments can be added below
