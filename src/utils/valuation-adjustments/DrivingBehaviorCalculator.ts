
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../rules/types';

export class DrivingBehaviorCalculator implements AdjustmentCalculator {
  async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Skip if no driving profile is provided
    if (!input.drivingProfile) {
      return null;
    }
    
    // Define driving profiles and their multipliers
    const drivingProfiles = {
      'gentle': 1.05,        // Gentle drivers maintain vehicle better: +5%
      'average': 1.00,       // Average driver: no adjustment
      'aggressive': 0.95,    // Aggressive driving wears vehicle more: -5%
      'commercial': 0.92,    // Commercial use (more wear): -8%
      'rideshare': 0.90      // Rideshare vehicles get a lot of wear: -10%
    };
    
    // Use provided profile or default to average
    const profile = input.drivingProfile.toLowerCase();
    const multiplier = drivingProfiles[profile as keyof typeof drivingProfiles] || 1.0;
    
    // Skip if default multiplier (no adjustment)
    if (multiplier === 1.0) {
      return null;
    }
    
    // Calculate the adjustment
    const adjustment = input.basePrice * (multiplier - 1);
    
    // Generate description based on driving profile
    let description = '';
    switch (profile) {
      case 'gentle':
        description = 'Vehicle driven gently with minimal wear and tear';
        break;
      case 'average':
        description = 'Vehicle driven with typical usage patterns';
        break;
      case 'aggressive':
        description = 'Vehicle driven aggressively, may have increased wear';
        break;
      case 'commercial':
        description = 'Vehicle used for commercial purposes, higher wear expected';
        break;
      case 'rideshare':
        description = 'Vehicle used for rideshare services, significant usage';
        break;
      default:
        description = `Driving profile: ${input.drivingProfile}`;
    }
    
    const name = 'Driving Behavior';
    const factor = name;
    const value = Math.round(adjustment);
    const impact = value;
    const percentAdjustment = multiplier - 1;
    
    return {
      factor: "Driving Behavior",
      impact,
      description,
      percentAdjustment
    };
  }
}
