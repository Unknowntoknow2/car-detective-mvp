
import { RulesEngineInput } from '../types';

export class CarfaxCalculator {
  calculate(input: RulesEngineInput) {
    // Check if carfaxData exists
    const hasCarfaxData = !!input.carfaxData;
    const impact = hasCarfaxData ? 2 : 0;
    
    return {
      factor: "CARFAX Report",
      impact,
      description: hasCarfaxData 
        ? "CARFAX report verified" 
        : "No CARFAX data available"
    };
  }
}
