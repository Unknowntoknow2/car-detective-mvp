
interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
}

interface LegacyAdjustment {
  label: string;
  value: number;
}

/**
 * Converts the new adjustment format to the legacy format expected by PDF generation
 */
export function convertAdjustmentsToLegacyFormat(adjustments: ValuationAdjustment[]): LegacyAdjustment[] {
  return adjustments.map(adjustment => ({
    label: adjustment.factor,
    value: adjustment.impact
  }));
}
