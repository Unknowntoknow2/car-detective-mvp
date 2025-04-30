
import { AdjustmentBreakdown, RulesEngineInput } from '../types';
import { getPhotoScoreAdjustmentDescription } from '../descriptions';

export class PhotoScoreCalculator {
  public calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.photoScore) {
      return null;
    }

    // Convert the 0-1 photo score to an adjustment factor
    // 0.9-1.0 = positive adjustment (excellent condition verified)
    // 0.7-0.9 = no adjustment (good condition verified)
    // 0.5-0.7 = slight negative (fair condition verified)
    // <0.5 = larger negative (poor condition verified)
    let percentAdjustment = 0;
    let description = '';

    if (input.photoScore >= 0.9) {
      percentAdjustment = 0.03; // +3% for excellent condition
      description = 'Excellent condition verified by photo';
    } else if (input.photoScore >= 0.7) {
      percentAdjustment = 0; // No adjustment for good condition
      description = 'Good condition verified by photo';
    } else if (input.photoScore >= 0.5) {
      percentAdjustment = -0.05; // -5% for fair condition
      description = 'Fair condition verified by photo';
    } else {
      percentAdjustment = -0.1; // -10% for poor condition
      description = 'Poor condition verified by photo';
    }

    // Apply adjustment to base price
    const adjustment = input.basePrice * percentAdjustment;

    return {
      name: 'Photo Score',
      value: adjustment,
      description: getPhotoScoreAdjustmentDescription(input.photoScore, percentAdjustment, adjustment),
      percentAdjustment
    };
  }
}
