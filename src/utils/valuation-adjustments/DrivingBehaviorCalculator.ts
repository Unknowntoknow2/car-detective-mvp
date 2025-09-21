
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from "../rules/types";

export class DrivingBehaviorCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    // Since drivingProfile doesn't exist on RulesEngineInput, we'll return null for now
    // This feature would need to be implemented when driving behavior data is available
    return null;
  }
}

export const drivingBehaviorCalculator = new DrivingBehaviorCalculator();
