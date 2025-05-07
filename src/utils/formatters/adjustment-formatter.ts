
import { AdjustmentBreakdown } from "@/utils/rules/types";

export function formatAdjustmentValue(value: number): string {
  const formatted = Math.abs(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatAdjustmentPercentage(percentage: number): string {
  const formatted = Math.abs(percentage).toFixed(1);
  return percentage >= 0 ? `+${formatted}%` : `-${formatted}%`;
}

export function convertNewAdjustmentsToLegacyFormat(
  adjustments: {
    factor: string;
    impact: number;
    description?: string;
  }[]
): AdjustmentBreakdown[] {
  return adjustments.map(adj => ({
    name: adj.factor,
    factor: adj.factor,
    impact: adj.impact,
    value: adj.impact,
    description: adj.description || `Adjustment based on ${adj.factor}`,
    percentAdjustment: adj.impact
  }));
}

export function convertLegacyAdjustmentsToNewFormat(
  adjustments: AdjustmentBreakdown[]
): {
  factor: string;
  impact: number;
  description: string;
}[] {
  return adjustments.map(adj => ({
    factor: adj.name,
    impact: adj.percentAdjustment,
    description: adj.description
  }));
}
