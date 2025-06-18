
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

// Add missing exports
export function getZipAdjustment(zipCode: string): number {
  const adjustment = getLocationAdjustment(zipCode);
  return adjustment ? adjustment.multiplier : 1.0;
}

export function getRegionNameFromZip(zipCode: string): string {
  const regionMap: Record<string, string> = {
    '90210': 'Beverly Hills',
    '10001': 'Manhattan',
    '94102': 'San Francisco',
    '02101': 'Boston',
  };
  
  return regionMap[zipCode] || 'Unknown Region';
}
