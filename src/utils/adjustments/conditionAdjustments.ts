
import { VehicleCondition } from './types';

export function getConditionAdjustment(condition: VehicleCondition, basePrice: number): number {
  const adjustments: Record<VehicleCondition, number> = {
    excellent: 0.05,
    good: 0,
    fair: -0.075,
    poor: -0.15
  };

  return basePrice * (adjustments[condition] || 0);
}
