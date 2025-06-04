<<<<<<< HEAD

import { AdjustmentBreakdown, RulesEngineInput } from "../types";

export class RecallCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Get recall status
    const hasOpenRecall = input.hasOpenRecall || false;
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Only apply adjustment if there are open recalls
    if (hasOpenRecall) {
      // Apply a discount for open recalls
      const impact = Math.round(basePrice * -0.05); // 5% discount for open recalls
      
      return {
        factor: "Open Safety Recall",
        impact,
        description: "Vehicle has open safety recalls that need to be addressed"
      };
    } else {
      // No impact if no open recalls
      return {
        factor: "Safety Recalls",
        impact: 0,
        description: "No open safety recalls detected"
      };
    }
=======
import { AdjustmentBreakdown, RulesEngineInput } from "../types";
import { Calculator } from "../interfaces/Calculator";

export class RecallCalculator implements Calculator {
  private RECALL_ADJUSTMENT_PERCENTAGE = -0.02; // -2% per open recall

  public async calculate(
    input: RulesEngineInput,
  ): Promise<AdjustmentBreakdown | null> {
    if (input.hasOpenRecall === undefined) {
      return null;
    }

    // No adjustment if there are no open recalls
    if (input.hasOpenRecall === false) {
      return null;
    }

    // Calculate value reduction (default to 1 recall if no specific count provided)
    const recallCount = input.hasOpenRecall ? (input.recallCount ?? 1) : 0;
    const percentAdjustment = this.RECALL_ADJUSTMENT_PERCENTAGE * recallCount;
    const valueAdjustment = input.basePrice * percentAdjustment;
    const factor = "Open Recalls";
    const impact = valueAdjustment;

    return {
      name: "Open Recalls",
      value: valueAdjustment,
      percentAdjustment: percentAdjustment * 100, // Convert to percentage for display
      description:
        `Vehicle has ${recallCount} open recall(s), which affects value by ${
          (percentAdjustment * 100).toFixed(1)
        }%`,
      factor,
      impact,
    };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
}
