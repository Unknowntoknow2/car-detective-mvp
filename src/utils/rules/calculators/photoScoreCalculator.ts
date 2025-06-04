<<<<<<< HEAD

import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';

// Simple helper function for photo score descriptions
function getPhotoScoreAdjustmentDescription(score: number, percentAdjustment: number, adjustment: number): string {
  if (score >= 0.9) {
    return `Photo analysis indicates excellent condition (+3% adjustment: +$${Math.abs(adjustment).toLocaleString()})`;
  } else if (score >= 0.7) {
    return 'Photo analysis confirms good condition (no adjustment needed)';
  } else if (score >= 0.5) {
    return `Photo analysis shows fair condition (-5% adjustment: -$${Math.abs(adjustment).toLocaleString()})`;
  } else {
    return `Photo analysis indicates poor condition (-10% adjustment: -$${Math.abs(adjustment).toLocaleString()})`;
  }
}
=======
import {
  AdjustmentBreakdown,
  AdjustmentCalculator,
  RulesEngineInput,
} from "../types";
import { getPhotoScoreAdjustmentDescription } from "../descriptions";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
    const basePrice = input.basePrice || 0;
    const adjustment = basePrice * percentAdjustment;
    const name = 'Photo Score';
=======
    const adjustment = input.basePrice * percentAdjustment;
    const name = "Photo Score";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    const factor = name;
    const impact = Math.round(adjustment);
    const value = impact;

    return {
      factor,
      impact,
      name,
      value,
      description: getPhotoScoreAdjustmentDescription(
        input.photoScore,
        percentAdjustment,
        adjustment,
      ),
      percentAdjustment,
    };
  }
}
