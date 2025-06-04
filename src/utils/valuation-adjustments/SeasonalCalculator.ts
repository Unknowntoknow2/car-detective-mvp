
import { AdjustmentBreakdown, RulesEngineInput } from '../rules/types';
import { Calculator } from '../rules/interfaces/Calculator';

interface SeasonalPattern {
  [month: number]: {
    label: string;
    adjustment: number;
    vehicleTypes: {
      [type: string]: number;
    };
  };
}

export class SeasonalCalculator implements Calculator {
  private seasonalPatterns: SeasonalPattern = {
    // January
    1: {
      label: 'Winter',
      adjustment: -0.02,
      vehicleTypes: {
        'suv': 0.01,
        'truck': 0.01,
        'convertible': -0.03,
        'sports': -0.02
      }
    },
    // February
    2: {
      label: 'Late Winter',
      adjustment: -0.01,
      vehicleTypes: {
        'suv': 0.005,
        'truck': 0.005,
        'convertible': -0.02,
        'sports': -0.01
      }
    },
    // March
    3: {
      label: 'Early Spring',
      adjustment: 0.01,
      vehicleTypes: {
        'convertible': 0.02,
        'sports': 0.01,
        'motorcycle': 0.03
      }
    },
    // April - December similar pattern...
    // This is a simplified version, you'd fill in all months
    6: {
      label: 'Summer',
      adjustment: 0.03,
      vehicleTypes: {
        'convertible': 0.04,
        'sports': 0.02,
        'suv': -0.01
      }
    },
    12: {
      label: 'Holiday Season',
      adjustment: 0.02,
      vehicleTypes: {
        'luxury': 0.03
      }
    }
  };

  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Get current month
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Get seasonal pattern for current month (use default if not defined)
    const seasonalPattern = this.seasonalPatterns[currentMonth] || {
      label: 'Mid-Season',
      adjustment: 0,
      vehicleTypes: {}
    };
    
    // Calculate base seasonal adjustment
    let totalAdjustment = seasonalPattern.adjustment;
    
    // Add vehicle type specific adjustment if applicable
    const bodyType = input.bodyType?.toLowerCase() || '';
    
    // Check each vehicle type for match
    for (const [type, adjustment] of Object.entries(seasonalPattern.vehicleTypes)) {
      if (bodyType.includes(type)) {
        totalAdjustment += adjustment;
        break; // Only apply the first matching type
      }
    }
    
    // Skip if no significant adjustment
    if (Math.abs(totalAdjustment) < 0.005) {
      return null;
    }
    
    // Calculate monetary value
    const adjustmentValue = input.basePrice * totalAdjustment;
    const factor = 'Seasonal Adjustment';
    const impact = Math.round(adjustmentValue);
    
    return {
      name: 'Seasonal Adjustment',
      value: Math.round(adjustmentValue),
      description: `${seasonalPattern.label} seasonal impact on vehicle value`,
      percentAdjustment: totalAdjustment * 100,
      factor,
      impact
    };
  }
}
