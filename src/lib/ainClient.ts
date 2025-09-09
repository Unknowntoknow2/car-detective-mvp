// Minimal client for Lovable app. Emits stable QA signals.
export type ValuationMeta = { 
  route: string; 
  corr_id: string | null; 
  upstream_status: string | null 
};

export async function runValuation(input: unknown): Promise<{ data: unknown; meta: ValuationMeta }> {
  const corrId = crypto.randomUUID();
  const res = await fetch('/functions/v1/valuation', {
    method: 'POST',
    headers: { 
      'content-type': 'application/json', 
      'x-correlation-id': corrId 
    },
    body: JSON.stringify(input ?? {}),
  });

  const meta: ValuationMeta = {
    route: res.headers.get('x-ain-route') ?? 'unknown',
    corr_id: res.headers.get('x-correlation-id'),
    upstream_status: res.headers.get('x-upstream-status'),
  };

  // Signals for QA tools and Playwright
  if (res.ok) console.log('ain.ok'); // backwards compatibility with existing checks
  console.log('ain.route', { ok: res.ok, ...meta });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`valuation_failed route=${meta.route} status=${res.status} corr_id=${meta.corr_id} body=${body}`);
  }

  return { data: await res.json(), meta };
}