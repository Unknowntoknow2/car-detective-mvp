
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from "../rules/types";

export class SeasonalCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.basePrice) return null;

    const currentMonth = new Date().getMonth();
    const isSpring = currentMonth >= 2 && currentMonth <= 4; // March-May
    const isSummer = currentMonth >= 5 && currentMonth <= 7; // June-August
    
    // Spring and summer typically have higher demand for vehicles
    if (isSpring || isSummer) {
      const adjustment = Math.round(input.basePrice * 0.01); // 1% seasonal boost

      return {
        factor: "Seasonal Demand",
        impact: adjustment,
        description: `${isSpring ? 'Spring' : 'Summer'} season increases demand`,
        name: "Seasonal Demand",
        value: adjustment,
        percentAdjustment: 1,
      };
    }

    return null;
  }
}

export const seasonalCalculator = new SeasonalCalculator();
