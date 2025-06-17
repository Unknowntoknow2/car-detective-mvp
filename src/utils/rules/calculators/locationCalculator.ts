
import { AdjustmentCalculator, RulesEngineInput, AdjustmentBreakdown } from "../types";

export class LocationCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.zipCode || !input.basePrice) return null;

    // Simple location-based adjustment (this would be more sophisticated in reality)
    const highValueZips = ['90210', '10001', '94102', '02101']; // Beverly Hills, NYC, SF, Boston
    const isHighValueArea = highValueZips.includes(input.zipCode);

    if (!isHighValueArea) return null;

    const adjustment = Math.round(input.basePrice * 0.03); // 3% increase for high-value areas

    return {
      factor: "Location Premium",
      impact: adjustment,
      description: `High-demand area (${input.zipCode}) increases value`,
      name: "Location Premium",
      value: adjustment,
      percentAdjustment: 3,
    };
  }
}

export const locationCalculator = new LocationCalculator();
