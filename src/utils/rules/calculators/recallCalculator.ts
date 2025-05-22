
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
  }
}
