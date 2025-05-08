
import { RulesEngineInput } from '../types';

// Create a simplified calculator since we don't have the full implementation
export class AccidentCalculator {
  calculate(input: RulesEngineInput) {
    // Default impact for accidents
    const accidentCount = input.accidentCount || 0;
    const impact = accidentCount > 0 ? -5 * accidentCount : 0;
    
    return {
      factor: "Accident History",
      impact,
      description: accidentCount > 0 
        ? `Vehicle has ${accidentCount} reported accident(s)` 
        : "No accidents reported"
    };
  }
}
