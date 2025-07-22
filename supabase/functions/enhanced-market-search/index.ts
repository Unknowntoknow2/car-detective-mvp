
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Define CORS headers for browser access
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
    const { make, model, year, zip, vin, exact = false } = await req.json();
    
    // Validate required parameters
    if (!make && !model && !vin) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`Fetching enhanced market listings for ${year} ${make} ${model} in ZIP code ${zip || 'any'}`);
    
    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Tracking sources for confidence calculation
    const dataSources = [];
    
    // Try to fetch exact VIN match first if provided
    if (vin) {
      console.log(`Searching for exact VIN match: ${vin}`);
      const { data: vinMatches, error: vinError } = await supabase
        .from('enhanced_market_listings')
        .select('*')
        .eq('vin', vin)
        .limit(10);
        
      if (!vinError && vinMatches && vinMatches.length > 0) {
        console.log(`Found ${vinMatches.length} exact VIN matches`);
        dataSources.push('exact_vin_match');
        
        // If we have exact VIN matches, return them immediately with high confidence
        return new Response(
          JSON.stringify({ 
            data: vinMatches,
            meta: {
              sources: dataSources,
              confidence: 95,
              exact_match: true,
              count: vinMatches.length
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Start building our query
    let query = supabase
      .from('enhanced_market_listings')
      .select('*')
      .order('fetched_at', { ascending: false });
      
    // Apply filters
    if (make) query = query.ilike('make', `%${make}%`);
    if (model) query = query.ilike('model', `%${model}%`);
    
    // For year, use exact match if requested, otherwise use a range
    if (year) {
      if (exact) {
        query = query.eq('year', year);
      } else {
        // Use a +/- 2 year range if not exact
        query = query
          .gte('year', year - 2)
          .lte('year', year + 2);
      }
    }
    
    // Add zip code filter if provided - we look for listings with the same first 3 digits
    // to capture the general region without being too restrictive
    if (zip && zip.length >= 3) {
      const zipPrefix = zip.substring(0, 3);
      query = query.ilike('zip_code', `${zipPrefix}%`);
      dataSources.push('geo_targeted');
    }
    
    // Execute query with a reasonable limit
    const { data: listings, error: listingsError } = await query.limit(30);
    
    if (listingsError) {
      console.error('Error fetching market listings:', listingsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch market listings' }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (listings && listings.length > 0) {
      console.log(`Found ${listings.length} market listings`);
      dataSources.push('market_listings');
      
      // Calculate confidence based on data quality
      let confidence = 70; // Base confidence
      
      // Adjust based on number of listings
      if (listings.length >= 10) confidence += 10;
      else if (listings.length >= 5) confidence += 5;
      
      // Adjust based on recency of data
      const recentListings = listings.filter(l => {
        const listingDate = new Date(l.fetched_at);
        const daysSinceListingUpdate = Math.floor((Date.now() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceListingUpdate <= 30; // Consider listings updated in the last 30 days as recent
      });
      
      if (recentListings.length > listings.length * 0.8) confidence += 5;
      
      // Calculate price statistics
      const prices = listings.map(listing => listing.price).filter(Boolean);
      const stats = calculatePriceStatistics(prices);
      
      return new Response(
        JSON.stringify({ 
          data: listings,
          meta: {
            sources: dataSources,
            confidence,
            exact_match: false,
            count: listings.length,
            stats
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log('No listings found, trying broader search...');
      
      // Try a broader search without year exact match
      let broadQuery = supabase
        .from('enhanced_market_listings')
        .select('*')
        .order('fetched_at', { ascending: false });
        
      if (make) broadQuery = broadQuery.ilike('make', `%${make}%`);
      
      // Loosen model constraint if needed
      if (model) {
        // Extract the first word of the model (e.g., "Camry" from "Camry LE")
        const baseModel = model.split(' ')[0];
        broadQuery = broadQuery.ilike('model', `%${baseModel}%`);
      }
      
      dataSources.push('broad_search');
      
      const { data: broadListings, error: broadError } = await broadQuery.limit(50);
      
      if (!broadError && broadListings && broadListings.length > 0) {
        console.log(`Found ${broadListings.length} listings in broader search`);
        
        // Calculate price statistics
        const prices = broadListings.map(listing => listing.price).filter(Boolean);
        const stats = calculatePriceStatistics(prices);
        
        return new Response(
          JSON.stringify({ 
            data: broadListings,
            meta: {
              sources: dataSources,
              confidence: 50, // Lower confidence for broader search
              exact_match: false,
              count: broadListings.length,
              stats
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        console.log('No listings found in broader search');
        
        // If we still don't have data, return a structured empty response
        return new Response(
          JSON.stringify({ 
            data: [],
            meta: {
              sources: [],
              confidence: 30,
              exact_match: false,
              count: 0
            }
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
  } catch (error) {
    console.error("Error in enhanced-market-search:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Helper function to calculate price statistics
function calculatePriceStatistics(prices: number[]) {
  if (!prices.length) return null;
  
  // Sort prices for percentile calculations
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  // Calculate min, max, mean
  const min = sortedPrices[0];
  const max = sortedPrices[sortedPrices.length - 1];
  const sum = sortedPrices.reduce((acc, price) => acc + price, 0);
  const mean = sum / sortedPrices.length;
  
  // Calculate median (50th percentile)
  const midIndex = Math.floor(sortedPrices.length / 2);
  const median = sortedPrices.length % 2 === 0
    ? (sortedPrices[midIndex - 1] + sortedPrices[midIndex]) / 2
    : sortedPrices[midIndex];
  
  // Calculate standard deviation
  const squaredDiffs = sortedPrices.map(price => Math.pow(price - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / sortedPrices.length;
  const stdDev = Math.sqrt(avgSquaredDiff);
  
  // Calculate percentiles
  const p25Index = Math.floor(sortedPrices.length * 0.25);
  const p75Index = Math.floor(sortedPrices.length * 0.75);
  
  return {
    min,
    max,
    mean,
    median,
    stdDev,
    p25: sortedPrices[p25Index],
    p75: sortedPrices[p75Index],
    count: sortedPrices.length,
    // Calculate interquartile range (for detecting outliers)
    iqr: sortedPrices[p75Index] - sortedPrices[p25Index]
  };
}
