
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: makes, error: makesError } = await supabase
      .from('makes')
      .select('*')
      .order('make_name');

    if (makesError) throw makesError;

    // Check if we have enough makes data
    if (!makes || makes.length < 10) {
      console.log("Insufficient makes data, inserting sample data");
      
      // Common car makes with logos
      const commonMakes = [
        { make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png', country_of_origin: 'United States' },
        { make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png', country_of_origin: 'United States' },
        { make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png', country_of_origin: 'Germany' },
        { make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png', country_of_origin: 'Germany' },
        { make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png', country_of_origin: 'Germany' },
        { make_name: 'Lexus', logo_url: 'https://www.carlogos.org/car-logos/lexus-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Hyundai', logo_url: 'https://www.carlogos.org/car-logos/hyundai-logo.png', country_of_origin: 'South Korea' },
        { make_name: 'Kia', logo_url: 'https://www.carlogos.org/car-logos/kia-logo.png', country_of_origin: 'South Korea' },
        { make_name: 'Nissan', logo_url: 'https://www.carlogos.org/car-logos/nissan-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Subaru', logo_url: 'https://www.carlogos.org/car-logos/subaru-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Volkswagen', logo_url: 'https://www.carlogos.org/car-logos/volkswagen-logo.png', country_of_origin: 'Germany' },
        { make_name: 'Mazda', logo_url: 'https://www.carlogos.org/car-logos/mazda-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Acura', logo_url: 'https://www.carlogos.org/car-logos/acura-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Infiniti', logo_url: 'https://www.carlogos.org/car-logos/infiniti-logo.png', country_of_origin: 'Japan' },
        { make_name: 'Jeep', logo_url: 'https://www.carlogos.org/car-logos/jeep-logo.png', country_of_origin: 'United States' },
        { make_name: 'Volvo', logo_url: 'https://www.carlogos.org/car-logos/volvo-logo.png', country_of_origin: 'Sweden' },
        { make_name: 'Dodge', logo_url: 'https://www.carlogos.org/car-logos/dodge-logo.png', country_of_origin: 'United States' },
        { make_name: 'Porsche', logo_url: 'https://www.carlogos.org/car-logos/porsche-logo.png', country_of_origin: 'Germany' },
        { make_name: 'Land Rover', logo_url: 'https://www.carlogos.org/car-logos/land-rover-logo.png', country_of_origin: 'United Kingdom' },
        { make_name: 'Jaguar', logo_url: 'https://www.carlogos.org/car-logos/jaguar-logo.png', country_of_origin: 'United Kingdom' },
        { make_name: 'Cadillac', logo_url: 'https://www.carlogos.org/car-logos/cadillac-logo.png', country_of_origin: 'United States' },
        { make_name: 'Buick', logo_url: 'https://www.carlogos.org/car-logos/buick-logo.png', country_of_origin: 'United States' },
        { make_name: 'Tesla', logo_url: 'https://www.carlogos.org/car-logos/tesla-logo.png', country_of_origin: 'United States' },
        { make_name: 'Genesis', logo_url: 'https://www.carlogos.org/car-logos/genesis-logo.png', country_of_origin: 'South Korea' },
        { make_name: 'GMC', logo_url: 'https://www.carlogos.org/car-logos/gmc-logo.png', country_of_origin: 'United States' },
        { make_name: 'Chrysler', logo_url: 'https://www.carlogos.org/car-logos/chrysler-logo.png', country_of_origin: 'United States' },
        { make_name: 'RAM', logo_url: 'https://www.carlogos.org/car-logos/ram-logo.png', country_of_origin: 'United States' },
        { make_name: 'MINI', logo_url: 'https://www.carlogos.org/car-logos/mini-logo.png', country_of_origin: 'United Kingdom' }
      ];
      
      // Insert the makes one by one, avoiding duplicates
      for (const make of commonMakes) {
        const { error } = await supabase
          .from('makes')
          .upsert(
            { make_name: make.make_name, logo_url: make.logo_url, country_of_origin: make.country_of_origin },
            { onConflict: 'make_name' }
          );
          
        if (error) {
          console.error(`Error inserting make ${make.make_name}:`, error);
        }
      }
      
      // Refetch makes after insert
      const { data: updatedMakes, error: updatedMakesError } = await supabase
        .from('makes')
        .select('*')
        .order('make_name');
        
      if (updatedMakesError) throw updatedMakesError;
      if (updatedMakes) {
        makes.length = 0; // Clear the array
        updatedMakes.forEach(make => makes.push(make)); // Add the new makes
      }
    }

    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('*')
      .order('model_name');

    if (modelsError) throw modelsError;

    return new Response(
      JSON.stringify({ makes, models }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});
