
import { RulesEngineInput } from '../rules/types';

export class DrivingBehaviorCalculator {
  calculate(input: RulesEngineInput) {
    // Default values
    const basePrice = input.basePrice || 0;
    const drivingScore = input.drivingScore || 50; // Default to average
    
    // Set impact based on driving score
    let impact = 0;
    let description = '';
    
    if (drivingScore >= 80) {
      // Good driving habits increase value
      impact = basePrice * 0.03; // 3% increase
      description = 'Excellent driving history';
    } else if (drivingScore >= 60) {
      // Average driving habits have no effect
      impact = 0;
      description = 'Good driving history';
    } else if (drivingScore >= 40) {
      // Below average driving habits decrease value slightly
      impact = basePrice * -0.02; // 2% decrease
      description = 'Average driving history';
    } else {
      // Poor driving habits decrease value significantly
      impact = basePrice * -0.05; // 5% decrease
      description = 'Below average driving history';
    }
    
    return {
      factor: 'Driving Behavior',
      impact: Math.round(impact),
      description,
      name: 'Driving Behavior',
      value: Math.round(impact),
      percentAdjustment: basePrice > 0 ? (impact / basePrice) * 100 : 0
    };
  }
}
