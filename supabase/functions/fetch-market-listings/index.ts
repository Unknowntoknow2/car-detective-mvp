
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { vin, make, model, year, zipCode } = await req.json();
    
    if ((!vin && (!make || !model || !year)) || !zipCode) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Check if we already have listings for this VIN or make/model/year
    let existingListings = [];
    
    if (vin) {
      const { data: vinListings } = await supabaseClient
        .from('market_listings')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false });
        
      if (vinListings && vinListings.length > 0) {
        existingListings = vinListings;
      }
    } else {
      const { data: mmyListings } = await supabaseClient
        .from('market_listings')
        .select('*')
        .eq('make', make)
        .eq('model', model)
        .eq('year', year)
        .order('created_at', { ascending: false });
        
      if (mmyListings && mmyListings.length > 0) {
        existingListings = mmyListings;
      }
    }
    
    // If we have recent listings (less than 24 hours old), return them
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    if (existingListings.length > 0 && 
        new Date(existingListings[0].created_at) > oneDayAgo) {
      
      // Process existing listings
      const sources: Record<string, string> = {};
      const averages: Record<string, number> = {};
      
      // Group by source
      const groupedListings: Record<string, any[]> = {};
      existingListings.forEach(listing => {
        if (!groupedListings[listing.source]) {
          groupedListings[listing.source] = [];
        }
        groupedListings[listing.source].push(listing);
        
        // Store the URL from the first listing per source
        if (!sources[listing.source]) {
          sources[listing.source] = listing.url || '';
        }
      });
      
      // Calculate averages
      Object.entries(groupedListings).forEach(([source, listings]) => {
        const sum = listings.reduce((total, listing) => total + listing.price, 0);
        averages[source] = Math.round(sum / listings.length);
      });
      
      return new Response(
        JSON.stringify({ 
          data: existingListings,
          averages,
          sources,
          fromCache: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we don't have recent listings, we would fetch new ones here
    // In a real implementation, this would call external APIs or scraping services
    // For demo purposes, we'll generate mock data
    
    const mockSources = ['cargurus', 'autotrader', 'cars.com', 'craigslist', 'facebook'];
    const mockListings = [];
    const averages: Record<string, number> = {};
    const sources: Record<string, string> = {};
    
    // Generate a base price based on make/model/year
    // This would be replaced with real data in production
    const basePrice = 15000 + (year - 2010) * 1000;
    
    // Generate mock listings for each source
    for (const source of mockSources) {
      // Create some variance in prices
      const variance = Math.random() * 0.2 - 0.1; // -10% to +10%
      const avgPrice = Math.round(basePrice * (1 + variance));
      
      // Store the average price for this source
      averages[source] = avgPrice;
      
      // Create a mock URL
      const mockUrl = `https://${source.toLowerCase()}.com/search?make=${make}&model=${model}&year=${year}&zip=${zipCode}`;
      sources[source] = mockUrl;
      
      // Create 2-4 listings per source with some price variation
      const numListings = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numListings; i++) {
        const listingVariance = Math.random() * 0.05 - 0.025; // -2.5% to +2.5%
        const price = Math.round(avgPrice * (1 + listingVariance));
        
        mockListings.push({
          source,
          price,
          url: mockUrl,
          title: `${year} ${make} ${model}`,
          mileage: Math.floor(Math.random() * 50000) + 10000,
          location: zipCode,
          image: `https://example.com/${source}-image-${i}.jpg`,
          created_at: new Date().toISOString(),
          vin: vin || `MOCK${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        });
      }
    }
    
    // In a real implementation, we would save these listings to the database
    // For simplicity, we'll skip that step in this demo
    
    return new Response(
      JSON.stringify({
        data: mockListings,
        averages,
        sources,
        fromCache: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error fetching market listings:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
