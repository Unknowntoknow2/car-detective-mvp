
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';

// Re-export types with 'export type' syntax for isolatedModules
export type { RulesEngineInput, AdjustmentBreakdown };

// Default export (placeholder for rulesEngine implementation)
export default {
  calculateAdjustments: async (input: RulesEngineInput): Promise<AdjustmentBreakdown[]> => {
    // Placeholder implementation
    return [];
  },
  calculateTotalAdjustment: (adjustments: AdjustmentBreakdown[]): number => {
    return adjustments.reduce((sum, adjustment) => sum + adjustment.value, 0);
  }
};
