
// Remove the non-existent import
export interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
}

export function calculateVehicleValue(
  baseValue: number,
  adjustments: AdjustmentItem[]
): number {
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  return Math.max(0, baseValue + totalAdjustment);
}
