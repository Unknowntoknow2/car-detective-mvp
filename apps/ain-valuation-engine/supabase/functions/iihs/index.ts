// @ts-ignore Deno std remote import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { fetchIIHSData } from '../../../apps/edge/services/iihsService.ts';
// @ts-ignore Supabase ESM shim
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

async function upsertIIHS(payload: any) {
  const { error } = await supabase.rpc('rpc_upsert_iihs', { p_payload: payload });
  if (error) throw error;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': '*' }});
  const { vin, year, make, model, trim } = await req.json();
  // TODO: decode VIN to year/make/model/trim if only vin is provided.
  const data = await fetchIIHSData({ year, make, model, trim });
  if (!data) return Response.json({ degraded: true }, { status: 200 });
  const payload = { program: 'IIHS', model_year: data.modelYear, make: data.make, model: data.model, trim: data.trim ?? null, crashworthiness: data.crashworthiness, crash_prevention: data.crash_prevention, headlights: data.headlights, raw_payload: data.rawPayload, fetched_at: new Date().toISOString(), source: 'IIHS scrape' };
  await upsertIIHS(payload);
  return Response.json(payload);
});
