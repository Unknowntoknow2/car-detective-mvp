
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';

export class MileageCalculator implements AdjustmentCalculator {
  public calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Calculate the expected annual mileage based on the vehicle's age
    const vehicleAge = new Date().getFullYear() - input.year;
    const expectedMileage = vehicleAge * 12000; // Assuming 12,000 miles per year as average
    const mileageDifference = input.mileage - expectedMileage;
    
    // Calculate adjustment as a percentage of the base price
    let percentAdjustment = 0;
    if (mileageDifference > 0) {
      // Higher than expected mileage: negative adjustment
      percentAdjustment = -Math.min(0.15, (mileageDifference / 10000) * 0.03);
    } else if (mileageDifference < 0) {
      // Lower than expected mileage: positive adjustment
      percentAdjustment = Math.min(0.1, (Math.abs(mileageDifference) / 10000) * 0.02);
    }
    
    const impact = Math.round(input.basePrice * percentAdjustment);
    const name = 'Mileage';
    
    return {
      factor: name,
      impact: impact,
      name: name,
      value: impact,
      description: this.getMileageDescription(input.mileage, expectedMileage, percentAdjustment),
      percentAdjustment
    };
  }
  
  private getMileageDescription(actual: number, expected: number, adjustment: number): string {
    const formattedActual = actual.toLocaleString();
    const formattedExpected = expected.toLocaleString();
    const adjustmentPercent = Math.abs(adjustment * 100).toFixed(1);
    
    if (adjustment > 0) {
      return `Vehicle has ${formattedActual} miles, which is lower than the expected ${formattedExpected} miles. This results in a +${adjustmentPercent}% adjustment.`;
    } else if (adjustment < 0) {
      return `Vehicle has ${formattedActual} miles, which is higher than the expected ${formattedExpected} miles. This results in a -${adjustmentPercent}% adjustment.`;
    } else {
      return `Vehicle has ${formattedActual} miles, which is close to the expected ${formattedExpected} miles. No adjustment needed.`;
    }
  }
}
