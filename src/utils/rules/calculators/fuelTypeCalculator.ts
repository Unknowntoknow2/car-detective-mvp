
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';

export class FuelTypeCalculator implements AdjustmentCalculator {
  public calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.fuelType) {
      return null;
    }

    const fuelType = input.fuelType.toLowerCase();
    let percentAdjustment = 0;

    // Apply different adjustments based on fuel type
    switch (fuelType) {
      case 'electric':
        percentAdjustment = 0.05; // +5% for electric
        break;
      case 'hybrid':
        percentAdjustment = 0.03; // +3% for hybrid
        break;
      case 'diesel':
        percentAdjustment = 0.02; // +2% for diesel
        break;
      case 'gasoline':
      case 'gas':
        percentAdjustment = 0; // No adjustment (baseline)
        break;
      default:
        return null; // Unknown fuel type
    }

    const value = input.basePrice * percentAdjustment;
    const name = 'Fuel Type';
    const factor = name;
    const impact = Math.round(value);

    return {
      name,
      factor,
      value,
      impact,
      percentAdjustment,
      description: `${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} fuel type adjustment`
    };
  }
}
