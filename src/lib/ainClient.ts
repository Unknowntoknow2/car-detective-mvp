// Hardened AIN client for professional valuations
export type AinMeta = { 
  route?: string; 
  corr_id?: string | null; 
  upstream_status?: string | null 
};

export type AinResponse = {
  estimated_value: number;
  confidence_score: number;
  breakdown?: any[];
  market_data?: Record<string, unknown>;
  explanation?: string;
  price_range_low?: number;
  price_range_high?: number;
  base_value?: number;
  adjustments?: any[];
};

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
  const corrId = crypto.randomUUID();
  const res = await fetch('/functions/v1/valuation', {
    method: 'POST',
    headers: { 
      'content-type': 'application/json', 
      'x-correlation-id': corrId 
    },
    body: JSON.stringify(payload),
  });

  const meta: AinMeta = {
    route: res.headers.get('x-ain-route') ?? undefined,
    corr_id: res.headers.get('x-correlation-id'),
    upstream_status: res.headers.get('x-upstream-status'),
  };

  // Signals for QA tools and Playwright

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`valuation_failed route=${meta.route} status=${res.status} corr_id=${meta.corr_id} body=${body}`);
  }

  return { data: await res.json() as AinResponse, meta };
}