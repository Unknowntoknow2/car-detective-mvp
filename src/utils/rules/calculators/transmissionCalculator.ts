
import { RulesEngineInput, AdjustmentCalculator } from '../types';

export class TransmissionCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput) {
    // Get transmission type and multiplier, defaulting if not present
    const transmissionType = input.transmission || '';
    const transmissionMultiplier = input.transmissionMultiplier || 1.0;
    
    let impact = 0;
    let description = '';
    
    // Calculate impact based on multiplier
    if (transmissionMultiplier > 1.0) {
      const basePrice = input.basePrice || 0;
      impact = basePrice * (transmissionMultiplier - 1.0);
      description = `Premium for ${transmissionType} transmission`;
    } else if (transmissionMultiplier < 1.0) {
      const basePrice = input.basePrice || 0;
      impact = basePrice * (transmissionMultiplier - 1.0);
      description = `Reduction for ${transmissionType} transmission`;
    } else {
      impact = 0;
      description = `No adjustment for ${transmissionType} transmission`;
    }
    
    // Premium transmissions usually add value
    if (transmissionType.toLowerCase().includes('automatic')) {
      if (impact === 0) {
        impact = 200; // Default premium for automatic if no multiplier
        description = 'Standard premium for automatic transmission';
      }
    } else if (transmissionType.toLowerCase().includes('manual')) {
      // Manual transmissions can add or reduce value depending on the vehicle
      if (impact === 0) {
        // No adjustment by default
        description = 'No adjustment for manual transmission';
      }
    }
    
    return {
      factor: "Transmission",
      impact,
      description,
      name: "Transmission Type",
      value: impact,
      percentAdjustment: input.basePrice ? (impact / input.basePrice) * 100 : 0
    };
  }
}
