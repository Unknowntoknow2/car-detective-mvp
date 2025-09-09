export interface AINValuationInput {
  vin?: string; make?: string; model?: string; year?: number;
  mileage: number; condition: "poor"|"fair"|"good"|"very_good"|"excellent";
  zip?: string; trim?: string;
}

export interface AINValuationResult {
  estimated_value: number; confidence_score: number; basis?: unknown;
}

const BASE = import.meta.env.VITE_AIN_VALUATION_URL!;
const KEY  = import.meta.env.VITE_AIN_API_KEY!;
const TIMEOUT = Number(import.meta.env.VITE_AIN_TIMEOUT_MS ?? 30000);

export async function ainGetValuation(input: AINValuationInput): Promise<AINValuationResult> {
  const ac = new AbortController(); 
  const t = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    const r = await fetch(`${BASE}/valuation`, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Authorization": `Bearer ${KEY}` },
      body: JSON.stringify(input),
      signal: ac.signal, 
      mode: "cors"
    });
    if (!r.ok) throw new Error(`AIN ${r.status}`);
    return await r.json();
  } finally { 
    clearTimeout(t); 
  }
}