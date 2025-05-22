
import { AdjustmentBreakdown, RulesEngineInput } from "../valuation/rules/types";

export class DrivingBehaviorCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Get driving score (0-100, higher is better)
    const drivingScore = input.drivingScore || 70; // Default to average if not provided
    const basePrice = input.basePrice || 20000; // Default if not provided
    
    // Calculate multiplier based on driving score
    let multiplier = 0;
    let description = "";
    
    if (drivingScore >= 90) {
      multiplier = 0.05; // 5% premium for excellent driving
      description = "Vehicle likely treated with exceptional care based on driving patterns";
    } else if (drivingScore >= 80) {
      multiplier = 0.03; // 3% premium for very good driving
      description = "Vehicle likely treated with above-average care based on driving patterns";
    } else if (drivingScore >= 70) {
      multiplier = 0.01; // 1% premium for good driving
      description = "Vehicle likely treated with good care based on driving patterns";
    } else if (drivingScore >= 60) {
      multiplier = 0; // No adjustment for average driving
      description = "Vehicle treated with average care based on driving patterns";
    } else if (drivingScore >= 50) {
      multiplier = -0.02; // 2% discount for below average driving
      description = "Vehicle may have been driven somewhat roughly based on patterns";
    } else {
      multiplier = -0.05; // 5% discount for poor driving
      description = "Vehicle likely driven roughly based on patterns";
    }
    
    // Calculate impact
    const impact = Math.round(basePrice * multiplier);
    
    return {
      factor: "Driving Behavior",
      impact,
      description
    };
  }
}
