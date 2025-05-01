
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, body } = req;
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    if (method === 'POST') {
      const { action, data } = await req.json();
      
      switch (action) {
        case 'get_vehicle_by_vin': {
          const { vin } = data;
          
          if (!vin) {
            return new Response(
              JSON.stringify({ error: 'VIN is required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          const { data: vehicle, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('vin', vin)
            .single();
            
          if (error) {
            if (error.code === 'PGRST116') { // Not found
              return new Response(
                JSON.stringify({ data: null }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
            
            throw error;
          }
          
          return new Response(
            JSON.stringify({ data: vehicle }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        case 'save_vehicle_history': {
          const { vin, title_brand, num_owners, has_full_service_history } = data;
          
          if (!vin) {
            return new Response(
              JSON.stringify({ error: 'VIN is required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          const { data: vehicle, error } = await supabase
            .from('vehicles')
            .upsert({
              vin,
              title_brand: title_brand || 'Clean',
              num_owners: num_owners || 1,
              has_full_service_history: has_full_service_history || false
            }, {
              onConflict: 'vin'
            })
            .select('*')
            .single();
            
          if (error) {
            throw error;
          }
          
          return new Response(
            JSON.stringify({ data: vehicle }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        case 'add_service_record': {
          const { vin, service_date, mileage, description, receipt_url } = data;
          
          if (!vin || !service_date) {
            return new Response(
              JSON.stringify({ error: 'VIN and service date are required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          // First, ensure the vehicle exists
          const { data: existingVehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .select('vin')
            .eq('vin', vin)
            .single();
            
          if (vehicleError && vehicleError.code === 'PGRST116') {
            // Create the vehicle if it doesn't exist
            await supabase
              .from('vehicles')
              .insert({
                vin,
                title_brand: 'Clean',
                num_owners: 1,
                has_full_service_history: false
              });
          }
          
          // Add the service record
          const { data: serviceRecord, error } = await supabase
            .from('service_history')
            .insert({
              vin,
              service_date,
              mileage,
              description,
              receipt_url
            })
            .select('*')
            .single();
            
          if (error) {
            throw error;
          }
          
          // Update the vehicle to indicate it has service history
          await supabase
            .from('vehicles')
            .update({ has_full_service_history: true })
            .eq('vin', vin);
          
          return new Response(
            JSON.stringify({ data: serviceRecord }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        case 'get_service_history': {
          const { vin } = data;
          
          if (!vin) {
            return new Response(
              JSON.stringify({ error: 'VIN is required' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          const { data: records, error } = await supabase
            .from('service_history')
            .select('*')
            .eq('vin', vin)
            .order('service_date', { ascending: false });
            
          if (error) {
            throw error;
          }
          
          return new Response(
            JSON.stringify({ data: records }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
