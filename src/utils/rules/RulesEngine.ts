
import { Calculator } from './interfaces/Calculator';
import { ValuationData, Adjustment } from './types';
import { accidentCalculator } from './calculators/accidentCalculator';
import { conditionCalculator } from './calculators/conditionCalculator';
import { mileageCalculator } from './calculators/mileageCalculator';
import { locationCalculator } from './calculators/locationCalculator';

export class RulesEngine {
  private calculators: Calculator[] = [];

  constructor() {
    this.initializeCalculators();
  }

  private initializeCalculators(): void {
    this.calculators = [
      accidentCalculator,
      conditionCalculator,
      mileageCalculator,
      locationCalculator,
    ];
  }

  public calculateAdjustments(data: ValuationData): Adjustment[] {
    const adjustments: Adjustment[] = [];

    for (const calculator of this.calculators) {
      try {
        const adjustment = calculator.calculate(data);
        if (adjustment) {
          adjustments.push(adjustment);
        }
      } catch (error) {
        console.error(`Error in calculator ${calculator.name}:`, error);
      }
    }

    return adjustments;
  }

  public calculateFinalValue(baseValue: number, adjustments: Adjustment[]): number {
    let finalValue = baseValue;

    for (const adjustment of adjustments) {
      finalValue += adjustment.impact;
    }

    return Math.max(0, finalValue);
  }
}
