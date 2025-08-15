import { supabase } from '@/integrations/supabase/client';
import { ListingAuditInput } from '@/types/audit';

export async function recordListingAudit(a: ListingAuditInput) {
  const payload = {
    valuation_id: a.valuationId,
    api_http_status: a.api?.httpStatus ?? null,
    api_ok: a.api?.ok ?? null,
    api_error: a.api?.error ?? null,
    retry_attempts: a.api?.retries ?? 0,
    stage_status: a.stageStatus ?? null,
    exclusion_reason: a.exclusionReason ?? null,
    trust_tier: a.trustTier ?? null,
    quality_score: a.qualityScore ?? null,
    included_in_comp_set: a.includedInCompSet ?? null
  };
  return await supabase.from('market_search_audit').insert(payload).select().single();
}

export async function snapshotListing(
  valuationId: string,
  listingUrl: string | undefined,
  source: string | undefined,
  snapshot: unknown
) {
  return await supabase.from('listing_audit_snapshots').insert({
    valuation_id: valuationId,
    listing_url: listingUrl ?? null,
    source: source ?? null,
    snapshot
  });
}

export async function recordValuationOutcome(valuationId: string, final: {
  finalMethod: 'market_based' | 'fallback_pricing' | 'broadened_search' | 'manual_match',
  confidenceCappedAt: number,
  valueRange: { low: number; high: number; pct: number }
}) {
  return await supabase.from('valuation_audit_logs').update({
    final_method: final.finalMethod,
    confidence_capped_at: final.confidenceCappedAt,
    value_range: final.valueRange as any
  }).eq('valuation_id', valuationId);
}