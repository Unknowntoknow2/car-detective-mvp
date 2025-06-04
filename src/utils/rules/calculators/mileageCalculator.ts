import {
  AdjustmentBreakdown,
  AdjustmentCalculator,
  RulesEngineInput,
} from "../types";

export class MileageCalculator implements AdjustmentCalculator {
<<<<<<< HEAD
  calculate(input: RulesEngineInput): AdjustmentBreakdown {
    // Default values if properties are undefined
    const year = input.year || new Date().getFullYear();
    const vehicleAge = new Date().getFullYear() - year;
    const mileage = input.mileage || 0;
    const basePrice = input.basePrice || input.baseValue || 0;
    
    // Average annual mileage is typically around 12,000-15,000 miles
    const averageAnnualMileage = 12000;
    const expectedMileage = vehicleAge * averageAnnualMileage;
    
    let percentAdjustment = 0;
    let description = '';
    
    if (mileage < expectedMileage * 0.7) {
      // Low mileage: positive adjustment
      percentAdjustment = 0.05; // 5% increase
      description = 'Below average mileage for the vehicle age';
    } else if (mileage > expectedMileage * 1.3) {
      // High mileage: negative adjustment
      percentAdjustment = -0.07; // 7% decrease
      description = 'Above average mileage for the vehicle age';
    } else {
      // Average mileage: no adjustment
      percentAdjustment = 0;
      description = 'Average mileage for the vehicle age';
    }
    
    const impact = basePrice * percentAdjustment;
    
    return {
      factor: 'mileage',
      impact,
      description,
      name: 'Mileage Adjustment',
      value: mileage,
      percentAdjustment
    };
  }
=======
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
      percentAdjustment = Math.min(
        0.1,
        (Math.abs(mileageDifference) / 10000) * 0.02,
      );
    }

    const impact = Math.round(input.basePrice * percentAdjustment);
    const name = "Mileage";

    return {
      factor: name,
      impact: impact,
      name: name,
      value: impact,
      description: this.getMileageDescription(
        input.mileage,
        expectedMileage,
        percentAdjustment,
      ),
      percentAdjustment,
    };
  }

  private getMileageDescription(
    actual: number,
    expected: number,
    adjustment: number,
  ): string {
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
