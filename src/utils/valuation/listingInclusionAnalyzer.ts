import { ListingQualityInput, ExclusionReason } from '@/types/audit';

export function scoreListingQuality(q: ListingQualityInput): { score: number; reason?: ExclusionReason } {
  let score = 0;

  // Base signals
  if (q.withinRadius) score += 20; else return { score: 0, reason: 'out_of_radius' };
  if (q.priceWithinBand) score += 20; else return { score: 10, reason: 'price_outlier' };
  if (q.listingFreshDays !== undefined) score += Math.max(0, 20 - Math.min(q.listingFreshDays, 20)); // fresher is better

  // Photos
  if (q.hasPhotos) score += Math.min(20, (q.photoCount ?? 0) * 3); // up to +20
  if (q.hasVinPhoto) score += 5;

  // Fees transparency
  score += Math.min(10, q.feeTransparency ?? 0);

  // Source tier weight
  const tier = q.sourceTierWeight ?? 0.85;
  score = Math.round(score * tier); // Tier1=0.95, Tier2=0.90, Tier3=0.85

  // Hard floors
  if (score < 35) return { score, reason: 'low_quality_score' };
  return { score };
}