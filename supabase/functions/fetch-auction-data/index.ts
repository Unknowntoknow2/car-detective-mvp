
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

  const url = new URL(req.url);
  const vin = url.searchParams.get('vin');
  const source = url.searchParams.get('source');
  
  if (!vin) {
    return new Response(
      JSON.stringify({ error: "Missing VIN parameter" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Check if we already have auction data for this VIN
    const { data: existingData } = await supabaseClient
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin)
      .order('fetched_at', { ascending: false });
      
    // If we have recent data (less than 7 days old), return it
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (existingData && existingData.length > 0 &&
        (!source || existingData.some(record => record.auction_source === source)) &&
        new Date(existingData[0].fetched_at) > oneWeekAgo) {
      
      // Filter by source if specified
      const filteredData = source 
        ? existingData.filter(record => record.auction_source === source)
        : existingData;
      
      return new Response(
        JSON.stringify({ 
          results: filteredData,
          fromCache: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // In a real implementation, we would call external APIs here
    // For demo purposes, we'll generate mock data
    
    // Generate mock auction results
    const mockResults = [];
    const possibleSources = ['manheim', 'iaai', 'copart'];
    const sourcesToUse = source ? [source] : possibleSources;
    
    for (const auctionSource of sourcesToUse) {
      // Create 0-3 auction records per source
      const numRecords = Math.floor(Math.random() * 4);
      
      for (let i = 0; i < numRecords; i++) {
        // Generate random date in the past year
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate() - Math.floor(Math.random() * 365));
        
        // Generate random price between $5,000 and $30,000
        const price = 5000 + Math.floor(Math.random() * 25000);
        
        // Generate random mileage between 10,000 and 150,000
        const odometer = 10000 + Math.floor(Math.random() * 140000);
        
        // Generate random location
        const locations = ['Atlanta, GA', 'Dallas, TX', 'Chicago, IL', 'Los Angeles, CA', 'New York, NY'];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Generate condition grades
        let conditionGrade;
        if (auctionSource === 'manheim') {
          conditionGrade = ['3.8', '4.2', '4.5', '3.2', '2.9'][Math.floor(Math.random() * 5)];
        } else {
          conditionGrade = ['Clean', 'Minor Damage', 'Moderate Damage', 'Severe Damage'][Math.floor(Math.random() * 4)];
        }
        
        // Generate mock photo URLs
        const photoUrls = [];
        for (let j = 0; j < 3; j++) {
          photoUrls.push(`https://example.com/${auctionSource}-${vin}-${j}.jpg`);
        }
        
        mockResults.push({
          id: crypto.randomUUID(),
          vin,
          auction_source: auctionSource,
          price: price.toString(),
          sold_date: soldDate.toISOString().split('T')[0],
          odometer: odometer.toString(),
          condition_grade: conditionGrade,
          location,
          photo_urls: photoUrls,
          fetched_at: new Date().toISOString(),
          source_priority: auctionSource === 'manheim' ? 1 : (auctionSource === 'iaai' ? 2 : 3)
        });
      }
    }
    
    // In a real implementation, we would save these results to the database
    if (mockResults.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('auction_results_by_vin')
        .insert(mockResults);
        
      if (insertError) {
        console.error("Error saving auction results:", insertError);
      }
    }
    
    return new Response(
      JSON.stringify({
        results: mockResults,
        fromCache: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error fetching auction data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
