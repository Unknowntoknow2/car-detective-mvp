
import { RulesEngineInput, AdjustmentCalculator } from '../types';

export class RecallCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput) {
    let impact = 0;
    let description = "";
    
    // Check if there are open recalls
    if (input.hasOpenRecall === true) {
      impact = -500; // Negative impact for open recalls
      description = "Vehicle has open recalls";
    } else if (input.hasOpenRecall === false) {
      impact = 0; // No impact for no open recalls
      description = "No open recalls";
    } else {
      // If recall information is not available
      impact = 0;
      description = "Recall information not available";
    }
    
    // Calculate percentage impact relative to base price
    const basePrice = input.basePrice || 0;
    const percentAdjustment = basePrice > 0 ? (impact / basePrice) * 100 : 0;
    
    return {
      factor: "Recall Status",
      impact,
      description,
      name: "Recall Status",
      value: impact,
      percentAdjustment
    };
  }
}
