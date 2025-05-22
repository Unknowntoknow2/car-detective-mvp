
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import { getPhotoScoreAdjustmentDescription } from '../../pdf/sections/sectionHelper';

export class PhotoScoreCalculator implements AdjustmentCalculator {
  public calculate(input: RulesEngineInput): AdjustmentBreakdown {
    if (!input.photoScore) {
      return {
        factor: 'Photo Score',
        impact: 0,
        description: 'No photo score available',
        name: 'Photo Score',
        value: 0,
        percentAdjustment: 0
      };
    }

    // Convert the 0-1 photo score to an adjustment factor
    // 0.9-1.0 = positive adjustment (excellent condition verified)
    // 0.7-0.9 = no adjustment (good condition verified)
    // 0.5-0.7 = slight negative (fair condition verified)
    // <0.5 = larger negative (poor condition verified)
    let percentAdjustment = 0;

    if (input.photoScore >= 0.9) {
      percentAdjustment = 0.03; // +3% for excellent condition
    } else if (input.photoScore >= 0.7) {
      percentAdjustment = 0; // No adjustment for good condition
    } else if (input.photoScore >= 0.5) {
      percentAdjustment = -0.05; // -5% for fair condition
    } else {
      percentAdjustment = -0.1; // -10% for poor condition
    }

    // Apply adjustment to base price
    const basePrice = input.basePrice || 0;
    const adjustment = basePrice * percentAdjustment;
    const name = 'Photo Score';
    const factor = name;
    const impact = Math.round(adjustment);
    const value = impact;

    return {
      factor,
      impact,
      name,
      value,
      description: getPhotoScoreAdjustmentDescription(input.photoScore, percentAdjustment, adjustment),
      percentAdjustment
    };
  }
}
