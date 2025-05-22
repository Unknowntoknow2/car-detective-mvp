
import { RulesEngineInput, AdjustmentCalculator } from '../types';

export class WarrantyCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput) {
    // Default values
    let impact = 0;
    let description = '';
    
    // Check warranty status
    const warrantyStatus = input.warrantyStatus || 'unknown';
    
    if (warrantyStatus === 'active') {
      // Active warranty adds value
      impact = 1000;
      description = 'Vehicle has active manufacturer warranty';
    } else if (warrantyStatus === 'expired') {
      // Expired warranty has no impact
      impact = 0;
      description = 'Manufacturer warranty has expired';
    } else if (warrantyStatus === 'extended') {
      // Extended warranty adds some value
      impact = 800;
      description = 'Vehicle has extended warranty';
    } else {
      // Unknown warranty status
      impact = 0;
      description = 'Warranty status unknown';
    }
    
    // Calculate percentage impact
    const basePrice = input.basePrice || 0;
    const percentAdjustment = basePrice > 0 ? (impact / basePrice) * 100 : 0;
    
    return {
      factor: "Warranty Status",
      impact,
      description,
      name: "Warranty",
      value: impact,
      percentAdjustment,
      warrantyType: warrantyStatus === 'extended' ? 'Extended' : 'Manufacturer'
    };
  }
}
