
import { AdjustmentBreakdown, RulesEngineInput } from '../types';
import { Calculator } from '../interfaces/Calculator';

export class RecallCalculator implements Calculator {
  private RECALL_ADJUSTMENT_PERCENTAGE = -0.02; // -2% per open recall

  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    if (input.hasOpenRecall === undefined) {
      return null;
    }

    // No adjustment if there are no open recalls
    if (input.hasOpenRecall === false) {
      return null;
    }

    // Calculate value reduction (default to 1 recall if no specific count provided)
    const recallCount = input.recallCount || 1;
    const percentAdjustment = this.RECALL_ADJUSTMENT_PERCENTAGE * recallCount;
    const valueAdjustment = input.basePrice * percentAdjustment;

    return {
      name: 'Open Recalls',
      value: valueAdjustment,
      percentAdjustment: percentAdjustment * 100, // Convert to percentage for display
      description: `Vehicle has ${recallCount} open recall(s), which affects value by ${(percentAdjustment * 100).toFixed(1)}%`
    };
  }
}
