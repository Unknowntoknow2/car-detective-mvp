
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0"
import { Make, Model } from "./types.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Common car makes with logos
    const commonMakes: Partial<Make>[] = [
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
      { make_name: 'MINI', logo_url: 'https://www.carlogos.org/car-logos/mini-logo.png', country_of_origin: 'United Kingdom' },
      { make_name: 'Mitsubishi', logo_url: 'https://www.carlogos.org/car-logos/mitsubishi-logo.png', country_of_origin: 'Japan' },
      { make_name: 'Lincoln', logo_url: 'https://www.carlogos.org/car-logos/lincoln-logo.png', country_of_origin: 'United States' },
      { make_name: 'Rivian', logo_url: 'https://www.carlogos.org/car-logos/rivian-logo.png', country_of_origin: 'United States' },
      { make_name: 'Lucid', logo_url: 'https://www.carlogos.org/car-logos/lucid-motors-logo.png', country_of_origin: 'United States' }
    ];

    console.log(`Importing ${commonMakes.length} makes`);

    // Upsert makes
    let insertedMakes = 0;
    for (const make of commonMakes) {
      const { error } = await supabase
        .from('makes')
        .upsert(make, { onConflict: 'make_name' });

      if (error) {
        console.error(`Error inserting make ${make.make_name}:`, error);
      } else {
        insertedMakes++;
      }
    }

    // Get makes with IDs for model relation
    const { data: insertedMakesData, error: makesQueryError } = await supabase
      .from('makes')
      .select('*')
      .order('make_name');

    if (makesQueryError) {
      throw makesQueryError;
    }

    // Map of common models by make
    const commonModelsByMake: Record<string, string[]> = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner', 'Prius', 'Sienna', 'Tundra', 'Land Cruiser'],
      'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Passport', 'Ridgeline', 'Insight'],
      'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Bronco', 'Edge', 'Expedition', 'Ranger', 'Focus', 'Fusion'],
      'Chevrolet': ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro', 'Corvette', 'Suburban', 'Traverse', 'Blazer', 'Colorado'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M3', '7 Series', 'X1', 'X7', 'i4', 'iX'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'G-Class', 'CLA', 'EQS'],
      'Audi': ['A4', 'A6', 'Q5', 'Q7', 'e-tron', 'A3', 'Q3', 'A8', 'Q8', 'RS6'],
      'Lexus': ['ES', 'RX', 'NX', 'LS', 'IS', 'GX', 'UX', 'LC', 'LX', 'RC'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq', 'Accent', 'Veloster'],
      'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'K5', 'Carnival', 'Niro'],
      'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Maxima', 'Murano', 'Armada', 'Kicks', 'Titan'],
      'Subaru': ['Forester', 'Outback', 'Impreza', 'Crosstrek', 'Legacy', 'Ascent', 'WRX', 'BRZ'],
      'Volkswagen': ['Golf', 'Jetta', 'Tiguan', 'Atlas', 'Passat', 'ID.4', 'Taos', 'Arteon', 'GTI', 'ID.Buzz'],
      'Mazda': ['Mazda3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30', 'Mazda6', 'CX-50', 'MX-30'],
      'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Grand Wagoneer', 'Wagoneer'],
      'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
    };

    // Default models for makes not explicitly covered
    const defaultModels = ['Base', 'Sport', 'Limited', 'Touring', 'Premium', 'Luxury', 'Standard'];

    // Import models for each make
    let totalModels = 0;
    for (const make of insertedMakesData) {
      // Get models for this make
      const modelsForMake = commonModelsByMake[make.make_name] || defaultModels;
      
      for (const modelName of modelsForMake) {
        const { error: modelError } = await supabase
          .from('models')
          .upsert({
            make_id: make.id,
            model_name: modelName
          }, { onConflict: 'make_id,model_name' });

        if (modelError) {
          console.error(`Error inserting model ${modelName} for make ${make.make_name}:`, modelError);
        } else {
          totalModels++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        makeCount: insertedMakes, 
        totalMakes: insertedMakesData.length,
        modelCount: totalModels
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Vehicle data import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
