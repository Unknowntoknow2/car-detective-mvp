
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Define CORS headers for browser access
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, make, model, year } = await req.json();
    
    if (!zipCode || !make || !model || !year) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Fetching market listings for ${year} ${make} ${model} in ZIP code ${zipCode}`);
    
    // This is a mock implementation since we don't have actual API keys
    // In a real implementation, you would call a real API or scraping service
    const mockData = generateMockListings(make, model, year, zipCode);
    
    return new Response(
      JSON.stringify({ data: mockData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error fetching market listings:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Mock function to generate sample market listings
function generateMockListings(make: string, model: string, year: number, zipCode: string) {
  // Generate a deterministic but seemingly random value from the input parameters
  const zipSum = zipCode.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const basePrice = 15000 + (year - 2010) * 1000;
  
  // Generate price variations based on zip code to simulate regional differences
  const marketMultiplier = 0.8 + (zipSum % 5) * 0.1; // Range from 0.8 to 1.2
  
  // Create mock sources with different price points
  const sources = [
    "Autotrader",
    "Cars.com",
    "CarGurus",
    "TrueCar",
    "Edmunds"
  ];

  // Create listings with varying prices
  const averages: Record<string, number> = {};
  const sourceUrls: Record<string, string> = {};

  sources.forEach((source, index) => {
    // Create some variance between sources
    const sourceFactor = 0.9 + (index * 0.05);
    const price = Math.round(basePrice * marketMultiplier * sourceFactor);
    
    averages[source] = price;
    sourceUrls[source] = `https://${source.toLowerCase().replace('.com', '')}.com/search?make=${make}&model=${model}&year=${year}&zip=${zipCode}`;
  });

  return {
    averages,
    sources: sourceUrls,
    marketFactor: marketMultiplier
  };
}
