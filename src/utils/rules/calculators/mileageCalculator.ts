
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';

export class MileageCalculator implements AdjustmentCalculator {
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
}
