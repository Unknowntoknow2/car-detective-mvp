
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { vin, make, model, year, zipCode, mileage, condition } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. Get auction data for the VIN
    const { data: auctionData, error: auctionError } = await supabase
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin);
    
    if (auctionError) {
      throw new Error(`Error fetching auction data: ${auctionError.message}`);
    }
    
    // 2. Get marketplace listings
    // This would normally fetch from various marketplace sources
    // For now, we'll use a simple query to our market_listings table
    
    let marketListings = [];
    
    // If we have a VIN, look for exact matches
    if (vin) {
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('vin', vin);
      
      if (!error && data) {
        marketListings = data;
      }
    }
    
    // If no direct VIN matches or no VIN provided, look for make/model/year matches
    if (marketListings.length === 0 && make && model && year) {
      const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('make', make)
        .eq('model', model)
        .eq('year', year);
      
      if (!error && data) {
        marketListings = data;
      }
    }
    
    // 3. Calculate average prices
    const calculateAverage = (arr: number[]) => 
      arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
    
    const retailPrices = marketListings
      .filter(l => ['cargurus', 'autotrader', 'cars.com'].includes(l.source))
      .map(l => l.price);
    
    const privatePrices = marketListings
      .filter(l => ['craigslist', 'facebook'].includes(l.source))
      .map(l => l.price);
    
    const auctionPrices = auctionData
      ? auctionData.map(a => parseFloat(a.price)).filter(p => !isNaN(p))
      : [];
    
    const averagePrices = {
      retail: Math.round(calculateAverage(retailPrices)),
      private: Math.round(calculateAverage(privatePrices)),
      auction: Math.round(calculateAverage(auctionPrices))
    };
    
    // 4. Calculate price range
    const allPrices = [...retailPrices, ...privatePrices, ...auctionPrices].filter(p => p > 0);
    
    const priceRange = {
      min: allPrices.length ? Math.min(...allPrices) : 0,
      max: allPrices.length ? Math.max(...allPrices) : 0
    };
    
    // 5. Determine market velocity and demand
    const listingCount = marketListings.length;
    const auctionCount = auctionData ? auctionData.length : 0;
    
    let marketVelocity = 'moderate';
    if (listingCount + auctionCount >= 10) marketVelocity = 'fast';
    if (listingCount + auctionCount <= 3) marketVelocity = 'slow';
    
    const demandScore = Math.min(10, Math.max(1, Math.round((listingCount + auctionCount) / 3)));
    
    // 6. Format response
    const result = {
      listings: marketListings,
      auctions: auctionData || [],
      averagePrices,
      priceRange,
      marketVelocity,
      demandScore,
      listingCount,
      auctionCount
    };
    
    // 7. Save a snapshot for later access
    if (vin) {
      await supabase
        .from('market_insights')
        .upsert({
          vin,
          data: result,
          created_at: new Date().toISOString(),
          make,
          model,
          year
        })
        .select();
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-market-intelligence:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
