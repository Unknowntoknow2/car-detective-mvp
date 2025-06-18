
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from "../rules/types";

export class MarketDemandCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.basePrice || !input.zipCode) return null;

    // Simple market demand calculation based on zip code
    const highDemandZips = ['90210', '10001', '94102', '02101'];
    const isHighDemand = highDemandZips.includes(input.zipCode);
    
    if (!isHighDemand) return null;

    const adjustment = Math.round(input.basePrice * 0.02); // 2% increase for high demand areas

    return {
      factor: "Market Demand",
      impact: adjustment,
      description: `High market demand in ${input.zipCode} increases value`,
      name: "Market Demand",
      value: adjustment,
      percentAdjustment: 2,
    };
  }
}

export const marketDemandCalculator = new MarketDemandCalculator();
