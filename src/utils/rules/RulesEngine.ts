
import { Calculator } from './interfaces/Calculator';
import { RulesEngineInput, ValuationData, Adjustment } from '../valuation/rules/types';
import { AccidentCalculator } from './calculators/accidentCalculator';
import { ConditionCalculator } from './calculators/conditionCalculator';
import { mileageCalculator } from './calculators/mileageCalculator';

export class RulesEngine {
  private calculators: Calculator[] = [];

  constructor() {
    this.initializeCalculators();
  }

  private initializeCalculators(): void {
    const accidentCalc = new AccidentCalculator();
    const conditionCalc = new ConditionCalculator();
    
    this.calculators = [
      {
        name: accidentCalc.constructor.name,
        description: 'Calculates accident-based adjustments',
        calculate: (data: ValuationData) => {
          const input = this.convertToRulesEngineInput(data);
          const result = accidentCalc.calculate(input);
          return result ? {
            factor: result.factor,
            impact: result.impact,
            description: result.description
          } : null;
        }
      },
      {
        name: conditionCalc.constructor.name,
        description: 'Calculates condition-based adjustments',
        calculate: (data: ValuationData) => {
          const input = this.convertToRulesEngineInput(data);
          const result = conditionCalc.calculate(input);
          return result ? {
            factor: result.factor,
            impact: result.impact,
            description: result.description
          } : null;
        }
      },
      mileageCalculator
    ];
  }

  private convertToRulesEngineInput(data: ValuationData): RulesEngineInput {
    return {
      make: data.make || '',
      model: data.model || '',
      year: data.year || 2020,
      mileage: data.mileage || 0,
      condition: data.condition || 'good',
      zipCode: data.zipCode,
      basePrice: data.basePrice || 0,
      baseValue: data.basePrice || 0,
      accidentCount: data.accidentCount || 0,
      trim: data.trim,
      fuelType: data.fuelType,
      transmissionType: data.transmission,
      exteriorColor: data.color,
      features: data.features,
      aiConditionOverride: data.aiConditionOverride,
      photoScore: data.photoScore,
      bodyType: data.bodyType,
      colorMultiplier: data.colorMultiplier,
      drivingScore: data.drivingScore
    };
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
