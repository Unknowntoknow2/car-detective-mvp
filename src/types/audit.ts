export type PipelineStage =
  | 'decode'
  | 'market_search'
  | 'normalize'
  | 'match'
  | 'quality_score'
  | 'comp_inclusion'
  | 'valuation';

export interface StageStatus {
  [stage: string]: boolean; // e.g., {decode:true, market_search:true, match:false}
}

export interface ApiOutcome {
  ok: boolean;
  httpStatus?: number;
  error?: string;
  retries?: number;
}

export type ExclusionReason =
  | 'low_quality_score'
  | 'out_of_radius'
  | 'price_outlier'
  | 'stale_listing'
  | 'missing_required_fields'
  | 'bad_source_tier'
  | 'trim_mismatch'
  | 'other';

export interface ListingAuditInput {
  valuationId: string;
  listingUrl?: string;
  source?: string;              // dealer/marketplace name
  stageStatus?: StageStatus;
  api?: ApiOutcome;
  trustTier?: 'Tier1' | 'Tier2' | 'Tier3';
  qualityScore?: number;        // 0..100
  includedInCompSet?: boolean;
  exclusionReason?: ExclusionReason | string;
}

export interface ListingQualityInput {
  odometer?: number;
  hasPhotos?: boolean;
  photoCount?: number;
  hasVinPhoto?: boolean;
  feeTransparency?: number; // 0..10
  sourceTierWeight?: number; // 0.85/0.90/0.95
  withinRadius?: boolean;
  priceWithinBand?: boolean;
  listingFreshDays?: number;
}