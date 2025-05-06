
export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
}

interface LegacyAdjustment {
  name: string;
  value: number;
  percentage: number;
}

// This is the format expected by the PDF generator
interface PdfAdjustment {
  label: string;
  value: number;
}

/**
 * Converts legacy adjustment format to the new format
 */
export function convertLegacyAdjustmentsToNewFormat(adjustments: LegacyAdjustment[]): ValuationAdjustment[] {
  return adjustments.map(adjustment => ({
    factor: adjustment.name,
    impact: adjustment.percentage,
    description: `Impact of ${adjustment.name} on vehicle value: ${adjustment.value}`
  }));
}

/**
 * Converts new adjustment format to legacy format
 */
export function convertNewAdjustmentsToLegacyFormat(adjustments: ValuationAdjustment[]): LegacyAdjustment[] {
  return adjustments.map(adjustment => ({
    name: adjustment.factor,
    value: 0, // We don't have this in the new format
    percentage: adjustment.impact
  }));
}

/**
 * Converts valuation adjustments to the format expected by PDF generator
 */
export function convertAdjustmentsToPdfFormat(adjustments: ValuationAdjustment[]): PdfAdjustment[] {
  return adjustments.map(adjustment => ({
    label: adjustment.factor,
    value: adjustment.impact
  }));
}
