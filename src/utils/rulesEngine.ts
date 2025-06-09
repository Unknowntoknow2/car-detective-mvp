
import { RulesEngine } from './rules/RulesEngine';
import { ValuationData } from './rules/types';

// Create a singleton instance
const rulesEngine = new RulesEngine();

export const calculateValuationAdjustments = (data: ValuationData) => {
  return rulesEngine.calculateAdjustments(data);
};

export const calculateFinalValuation = (baseValue: number, adjustments: any[]) => {
  return rulesEngine.calculateFinalValue(baseValue, adjustments);
};

// Re-export types for convenience
export type { ValuationData, Adjustment } from './rules/types';
