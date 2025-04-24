
import { AdjustmentBreakdown, RulesEngineInput } from './types';
import { MileageCalculator } from './calculators/mileageCalculator';
import { ConditionCalculator } from './calculators/conditionCalculator';
import { LocationCalculator } from './calculators/locationCalculator';
import { TrimCalculator } from './calculators/trimCalculator';
import { AccidentCalculator } from './calculators/accidentCalculator';
import { FeaturesCalculator } from './calculators/featuresCalculator';

export class RulesEngine {
  private calculators = [
    new MileageCalculator(),
    new ConditionCalculator(),
    new LocationCalculator(),
    new TrimCalculator(),
    new AccidentCalculator(),
    new FeaturesCalculator()
  ];

  public calculateAdjustments(input: RulesEngineInput): AdjustmentBreakdown[] {
    const adjustments: AdjustmentBreakdown[] = [];
    
    for (const calculator of this.calculators) {
      const adjustment = calculator.calculate(input);
      if (adjustment) {
        adjustments.push(adjustment);
      }
    }
    
    return adjustments;
  }

  public calculateTotalAdjustment(adjustments: AdjustmentBreakdown[]): number {
    return adjustments.reduce((sum, item) => sum + item.value, 0);
  }
}

// Singleton instance
const rulesEngine = new RulesEngine();
export default rulesEngine;
