
import {
  AdjustmentBreakdown,
  AdjustmentCalculator,
  RulesEngineInput,
} from "../../valuation/rules/types";

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    const conditionRules: Record<string, number> = {
      excellent: 0.05,
      good: 0,
      fair: -0.10,
      poor: -0.25
    };

    const conditionValue = (input.condition || "good").toLowerCase();
    const adjustment = conditionRules[conditionValue] !== undefined && input.basePrice !== undefined
      ? input.basePrice * conditionRules[conditionValue]
      : 0;

    if (adjustment === 0) return null;

    return {
      factor: "Condition Impact",
      impact: Math.round(adjustment),
      name: "Condition Impact",
      value: Math.round(adjustment),
      description: `Vehicle in ${input.condition || "good"} condition`,
      percentAdjustment: conditionRules[conditionValue] || 0,
    };
  }
}

export const conditionCalculator = new ConditionCalculator();
