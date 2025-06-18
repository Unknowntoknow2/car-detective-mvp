
// Location-based valuation adjustments
export interface LocationAdjustment {
  zipCode: string;
  multiplier: number;
  reason: string;
}

export function getLocationAdjustment(zipCode: string): LocationAdjustment | null {
  const highValueZips: Record<string, { multiplier: number; reason: string }> = {
    '90210': { multiplier: 1.05, reason: 'Beverly Hills premium market' },
    '10001': { multiplier: 1.04, reason: 'Manhattan premium market' },
    '94102': { multiplier: 1.06, reason: 'San Francisco premium market' },
    '02101': { multiplier: 1.03, reason: 'Boston premium market' },
  };

  const adjustment = highValueZips[zipCode];
  if (!adjustment) return null;

  return {
    zipCode,
    multiplier: adjustment.multiplier,
    reason: adjustment.reason,
  };
}
