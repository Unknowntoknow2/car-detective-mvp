import { createClient } from '@supabase/supabase-js';

// Hardened AIN client for professional valuations
export type AinMeta = {
  route?: string;
  corr_id?: string | null;
  upstream_status?: string | null
};

type NormalizedValuationResponse = {
  finalValue?: number;
  priceRange?: [number, number];
  confidenceScore?: number;
  adjustments?: any[];
  explanation?: string;
  marketListingsCount?: number;
  sourcesUsed?: string[];
  baseValue?: number;
  market_data?: Record<string, unknown>;
};

export type AinResponse = NormalizedValuationResponse & {
  estimated_value: number;
  confidence_score: number;
  price_range_low?: number;
  price_range_high?: number;
  price_range?: [number, number];
  breakdown?: any[];
  market_data?: Record<string, unknown>;
  base_value?: number;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'car-detective-auth-storage',
      },
    })
  : null;

function mapToLegacyResponse(data: NormalizedValuationResponse | null | undefined): AinResponse {
  const finalValue = data?.finalValue ?? 0;
  const priceRange = (data?.priceRange && data.priceRange.length === 2)
    ? [data.priceRange[0] ?? 0, data.priceRange[1] ?? 0] as [number, number]
    : [0, 0];
  const confidenceScore = data?.confidenceScore ?? 0;
  const adjustments = data?.adjustments ?? [];

  const marketData: Record<string, unknown> = data?.market_data ? { ...data.market_data } : {};
  if (data?.marketListingsCount !== undefined) {
    marketData.market_listings_count = data.marketListingsCount;
  }
  if (data?.sourcesUsed) {
    marketData.sources_used = data.sourcesUsed;
  }

  return {
    finalValue,
    priceRange,
    confidenceScore,
    adjustments,
    explanation: data?.explanation,
    marketListingsCount: data?.marketListingsCount,
    sourcesUsed: data?.sourcesUsed,
    estimated_value: finalValue,
    confidence_score: confidenceScore,
    price_range_low: priceRange[0],
    price_range_high: priceRange[1],
    price_range: priceRange,
    breakdown: adjustments,
    market_data: Object.keys(marketData).length ? marketData : undefined,
    base_value: data?.baseValue ?? finalValue,
  };
}

export async function runValuation(payload: {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage: number;
  zip_code?: string;
  condition: "poor" | "fair" | "good" | "very_good" | "excellent";
  requested_by?: string;
}): Promise<{ data: AinResponse; meta: AinMeta }> {
  if (!supabase) {
    throw new Error('Supabase environment not configured');
  }
  const corrId = crypto.randomUUID();
  const { data, error } = await supabase.functions.invoke<NormalizedValuationResponse>('ain-valuation', {
    body: payload,
    headers: { 'x-correlation-id': corrId },
  });

  const meta: AinMeta = {
    route: 'ain-valuation',
    corr_id: corrId,
    upstream_status: null,
  };

  if (error) {
    console.log('ain.route', { ok: false, ...meta });
    throw new Error(`valuation_failed corr_id=${corrId} detail=${error.message}`);
  }

  console.log('ain.ok');
  console.log('ain.route', { ok: true, ...meta });

  return { data: mapToLegacyResponse(data), meta };
}

