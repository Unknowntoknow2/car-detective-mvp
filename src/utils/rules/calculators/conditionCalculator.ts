<<<<<<< HEAD

import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
// Import rules dynamically to avoid TypeScript error
const rulesConfig = require('../../valuationRules.json');

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const conditionRules = rulesConfig.adjustments.condition as Record<string, number>;
    const conditionValue = (input.condition || 'good').toLowerCase() as keyof typeof conditionRules;
    const adjustment = conditionRules[conditionValue] !== undefined && input.basePrice !== undefined
      ? input.basePrice * conditionRules[conditionValue] 
=======
import {
  AdjustmentBreakdown,
  AdjustmentCalculator,
  RulesEngineInput,
} from "../types";
import rulesConfig from "../../valuationRules.json";

export class ConditionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    const conditionRules = rulesConfig.adjustments.condition as Record<
      string,
      number
    >;
    const conditionValue = input.condition
      .toLowerCase() as keyof typeof conditionRules;
    const adjustment = conditionRules[conditionValue] !== undefined
      ? input.basePrice * conditionRules[conditionValue]
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      : 0;

    return {
      factor: "Condition Impact",
      impact: Math.round(adjustment),
      name: "Condition Impact", // For backward compatibility
      value: Math.round(adjustment), // For backward compatibility
<<<<<<< HEAD
      description: `Vehicle in ${input.condition || 'good'} condition`,
      percentAdjustment: conditionRules[conditionValue] || 0
=======
      description: `Vehicle in ${input.condition} condition`,
      percentAdjustment: conditionRules[conditionValue] || 0,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    };
  }
}
