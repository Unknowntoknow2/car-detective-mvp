import {
  AdjustmentBreakdown,
  AdjustmentCalculator,
  RulesEngineInput,
} from "../types";

// Use dynamic `require` to avoid ES module issues with `.json` in some environments
const rulesConfig = require("../../valuationRules.json");

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const conditionRules = rulesConfig.adjustments.condition as Record<
      string,
      number
    >;

    const conditionValue = (input.condition || "good").toLowerCase() as keyof typeof conditionRules;

    const adjustment = conditionRules[conditionValue] !== undefined && input.basePrice !== undefined
      ? input.basePrice * conditionRules[conditionValue]
      : 0;

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
