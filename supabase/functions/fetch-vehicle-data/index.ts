
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Mock data for makes
    const mockMakes = [
      { id: 'toyota', make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png', country_of_origin: 'Japan' },
      { id: 'honda', make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png', country_of_origin: 'Japan' },
      { id: 'ford', make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png', country_of_origin: 'USA' },
      { id: 'chevrolet', make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png', country_of_origin: 'USA' },
      { id: 'bmw', make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png', country_of_origin: 'Germany' },
      { id: 'mercedes', make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png', country_of_origin: 'Germany' },
      { id: 'audi', make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png', country_of_origin: 'Germany' },
      { id: 'volvo', make_name: 'Volvo', logo_url: 'https://www.carlogos.org/car-logos/volvo-logo.png', country_of_origin: 'Sweden' }
    ];
    
    // Mock data for models
    const mockModels = [
      // Toyota models
      { id: 'camry', model_name: 'Camry', make_id: 'toyota' },
      { id: 'corolla', model_name: 'Corolla', make_id: 'toyota' },
      { id: 'rav4', model_name: 'RAV4', make_id: 'toyota' },
      
      // Honda models
      { id: 'civic', model_name: 'Civic', make_id: 'honda' },
      { id: 'accord', model_name: 'Accord', make_id: 'honda' },
      { id: 'crv', model_name: 'CR-V', make_id: 'honda' },
      
      // Ford models
      { id: 'f150', model_name: 'F-150', make_id: 'ford' },
      { id: 'mustang', model_name: 'Mustang', make_id: 'ford' },
      { id: 'explorer', model_name: 'Explorer', make_id: 'ford' },
      
      // Chevrolet models
      { id: 'silverado', model_name: 'Silverado', make_id: 'chevrolet' },
      { id: 'malibu', model_name: 'Malibu', make_id: 'chevrolet' },
      { id: 'equinox', model_name: 'Equinox', make_id: 'chevrolet' },
      
      // BMW models
      { id: '3series', model_name: '3 Series', make_id: 'bmw' },
      { id: '5series', model_name: '5 Series', make_id: 'bmw' },
      { id: 'x5', model_name: 'X5', make_id: 'bmw' },
      
      // Mercedes models
      { id: 'cclass', model_name: 'C-Class', make_id: 'mercedes' },
      { id: 'eclass', model_name: 'E-Class', make_id: 'mercedes' },
      { id: 'gclass', model_name: 'G-Class', make_id: 'mercedes' },
      
      // Audi models
      { id: 'a4', model_name: 'A4', make_id: 'audi' },
      { id: 'q5', model_name: 'Q5', make_id: 'audi' },
      { id: 'a6', model_name: 'A6', make_id: 'audi' },
      
      // Volvo models
      { id: 'xc90', model_name: 'XC90', make_id: 'volvo' },
      { id: 's60', model_name: 'S60', make_id: 'volvo' },
      { id: 'v60', model_name: 'V60', make_id: 'volvo' }
    ];

    return new Response(
      JSON.stringify({ 
        makes: mockMakes, 
        models: mockModels,
        makeCount: mockMakes.length,
        modelCount: mockModels.length
      }),
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
