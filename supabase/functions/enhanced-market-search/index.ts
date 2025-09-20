import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zip: string;
  radius?: number;
}

// MarketListing type definition for Deno Edge Functions (cannot import from main app)
interface MarketListing {
  id?: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  condition?: string;
  source: string;
  listing_url?: string;
  location?: string;
  dealer_name?: string;
  confidence_score: number;
  fetched_at: string;
}

interface EnhancedSearchResponse {
  listings: MarketListing[];
  count: number;
  average_price: number;
  price_range: {
    min: number;
    max: number;
  };
  confidence_score: number;
  search_metadata: {
    radius_miles: number;
    search_timestamp: string;
    fallback_used: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { make, model, year, trim, mileage, condition, zip, radius = 50 }: SearchRequest = await req.json();
    
    console.log(`🔍 Enhanced market search for: ${year} ${make} ${model} near ${zip} (${radius}mi radius)`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build search query with enhanced parameters
    let query = supabase
      .from('market_listings')
      .select('*')
      .eq('make', make.toLowerCase())
      .eq('model', model.toLowerCase())
      .eq('year', year)
      .order('confidence_score', { ascending: false })
      .limit(50);

    // Add optional filters
    if (trim) {
      query = query.ilike('trim', `%${trim}%`);
    }

    if (condition) {
      query = query.eq('condition', condition);
    }

    // Execute the search
    const { data: listings, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    // Calculate enhanced metrics
    const validListings = listings || [];
    const prices = validListings.map(l => l.price).filter(p => p > 0);
    
    const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    // Calculate overall confidence based on listing count and quality
    const confidenceScore = Math.min(100, Math.max(0, 
      (validListings.length * 10) + 
      (validListings.filter(l => l.confidence_score >= 80).length * 5)
    ));

    const response: EnhancedSearchResponse = {
      listings: validListings,
      count: validListings.length,
      average_price: Math.round(averagePrice),
      price_range: {
        min: minPrice,
        max: maxPrice
      },
      confidence_score: confidenceScore,
      search_metadata: {
        radius_miles: radius,
        search_timestamp: new Date().toISOString(),
        fallback_used: validListings.length === 0
      }
    };

    console.log(`✅ Enhanced search completed: ${validListings.length} listings found, confidence: ${confidenceScore}%`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Enhanced market search error:', error);
    
    // Return fallback response on error
    const fallbackResponse: EnhancedSearchResponse = {
      listings: [],
      count: 0,
      average_price: 0,
      price_range: { min: 0, max: 0 },
      confidence_score: 0,
      search_metadata: {
        radius_miles: 50,
        search_timestamp: new Date().toISOString(),
        fallback_used: true
      }
    };

    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 with fallback data instead of error
    });
  }
});