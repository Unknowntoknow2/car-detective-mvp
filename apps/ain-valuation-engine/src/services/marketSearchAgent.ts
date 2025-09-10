import type { MarketListing } from '../types/marketListing';
import { normalizeListing } from './normalizeListing';
import { dedupeListings } from './deduplicateListings';

// --- You can move these env reads to your config module if you prefer.
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
const EDGE_FN = 'enhanced-market-search';

// Minimal call to the Supabase Edge Function that returns real listings.
// Assumes RLS/anon access is set up for this function. If you require a key,
// inject it via VITE_SUPABASE_ANON_KEY and add the Authorization header.
async function callEnhancedMarketSearch(input: {
  vin?: string; year?: number; make?: string; model?: string; trim?: string;
  zipcode?: string; radiusMiles?: number;
}): Promise<any[]> {
  const url = `${SUPABASE_URL}/functions/v1/${EDGE_FN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header if your Edge Function requires it:
      // 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    // Surface a helpful error; do not throw to keep pipeline resilient
    const text = await res.text().catch(()=>'');
    console.warn(`[marketSearchAgent] ${EDGE_FN} non-200:`, res.status, text);
    return [];
  }
  const data = await res.json().catch(() => []);
  // Expecting an array of raw listing objects
  return Array.isArray(data) ? data : (data?.listings ?? []);
}

// Optional: augmentation via OpenAI-backed web search (if your project has it).
// Keep it stubbed for now to ship; you can wire your openaiExtractor later.
async function callOpenAIWebSearch(_input: {
  vin?: string; year?: number; make?: string; model?: string; trim?: string;
  zipcode?: string; radiusMiles?: number;
}): Promise<any[]> {
  // TODO: implement via your existing openaiExtractor/multiTierSearchAgent.
  // For launch day, rely on the Edge Function (it should already aggregate).
  return [];
}

export async function fetchMarketListings(input: {
  vin?: string; year: number; make: string; model: string; trim?: string;
  zipcode?: string; radiusMiles?: number;
}): Promise<{ listings: MarketListing[]; diagnostics: any }> {
  const diagnostics: any = { input, stages: [] };

  const primary = await callEnhancedMarketSearch(input);
  diagnostics.stages.push({ supabase_count: primary?.length ?? 0 });

  let augmented: any[] = [];
  if (!primary || primary.length < 3) {
    augmented = await callOpenAIWebSearch(input);
    diagnostics.stages.push({ openai_count: augmented?.length ?? 0 });
  }

  const normalized = [...(primary ?? []), ...(augmented ?? [])]
    .map(normalizeListing)
    .filter(l => typeof l.price === 'number' && l.price > 0 && (l.trust_score ?? 0) >= 0.4);

  const listings = dedupeListings(normalized);
  diagnostics.final_count = listings.length;

  return { listings, diagnostics };
}
