// @ts-ignore Deno std remote import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { fetchOEMFeatures } from '../../../apps/edge/services/oemFeaturesService.ts';
// @ts-ignore Supabase ESM shim
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

async function upsertOEM(payload: any) {
  const { error } = await supabase.rpc('rpc_upsert_oem_features', { p_payload: payload });
  if (error) throw error;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': '*' }});
  
  try {
    const { vin, year, make, model, trim } = await req.json();
    
    // If VIN is provided, try to fetch features
    if (vin) {
      const data = await fetchOEMFeatures(vin);
      if (data) {
        const payload = { 
          vin: vin,
          features: data.features_json, 
          confidence_score: data.confidence, 
          raw_payload: data.rawPayload, 
          fetched_at: new Date().toISOString(), 
          source: 'OEM_SCRAPE' 
        };
        await upsertOEM(payload);
        return Response.json(payload);
      }
    }
    
    // If direct vehicle info is provided or VIN fetch failed, return mock data
    if (year && make && model) {
      const mockFeatures = {
        safety_systems: { collision_warning: true, lane_departure: true },
        infotainment: { apple_carplay: true, bluetooth: true },
        comfort: { heated_seats: trim?.includes('XLE') || trim?.includes('LIMITED') }
      };
      
      const payload = { 
        program: 'OEM_FEATURES',
        model_year: year,
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        trim: trim?.toUpperCase() || null,
        vin: vin || null,
        features: mockFeatures, 
        confidence_score: 0.85, 
        fetched_at: new Date().toISOString(), 
        source: 'OEM_MOCK' 
      };
      
      await upsertOEM(payload);
      return Response.json(payload);
    }
    
    return Response.json({ error: 'Either vin or (year, make, model) required' }, { status: 400 });
    
  } catch (error) {
    console.error('OEM Features error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});
