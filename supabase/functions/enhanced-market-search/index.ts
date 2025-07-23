import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketSearchParams {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  zip: string;
  zipCode?: string;
  radius?: number;
  exact?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: MarketSearchParams = await req.json();
    console.log('🔍 Enhanced Market Search Request:', params);

    // Normalize parameters
    const searchParams = {
      make: params.make,
      model: params.model,
      year: params.year,
      trim: params.trim,
      zip: params.zip || params.zipCode,
      mileage: params.mileage,
      radius: params.radius || 100
    };

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, try to get cached listings from enhanced_market_listings
    console.log('🔍 Searching for cached listings with params:', searchParams);
    const { data: cachedListings, error: cacheError } = await supabase
      .from('enhanced_market_listings')
      .select('*')
      .ilike('make', searchParams.make) // Case-insensitive
      .ilike('model', searchParams.model) // Case-insensitive  
      .eq('year', searchParams.year)
      .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('price', { ascending: true })
      .limit(50);
      
    console.log('📊 Database query result:', { found: cachedListings?.length || 0, error: cacheError });

    if (cachedListings && cachedListings.length >= 1) { // ✅ Lowered threshold to test with available data
      console.log(`✅ Found ${cachedListings.length} cached listings`);
      
      const transformedListings = cachedListings.map(listing => ({
        id: listing.id,
        title: `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`,
        price: listing.price,
        mileage: listing.mileage,
        year: listing.year,
        make: listing.make,
        model: listing.model,
        trim: listing.trim,
        vin: listing.vin,
        location: listing.location,
        dealerName: listing.dealer_name,
        link: listing.listing_url,
        listingUrl: listing.listing_url,
        imageUrl: listing.photos?.[0] || null,
        source: listing.source,
        condition: listing.condition,
        isCpo: listing.is_cpo,
        confidenceScore: listing.confidence_score,
        fetchedAt: listing.fetched_at
      }));
      
      return new Response(JSON.stringify({
        success: true,
        data: transformedListings,
        meta: {
          confidence: 85,
          sources: [...new Set(cachedListings.map(l => l.source))],
          totalFound: cachedListings.length,
          searchMethod: 'enhanced_database',
          cacheHit: true
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no cache hit, call OpenAI market search
    console.log('🔄 No cached data found, calling OpenAI market search...');
    
    try {
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('openai-market-search', {
        body: searchParams
      });
      
      console.log('📊 OpenAI search response:', { success: openaiData?.success, dataLength: openaiData?.data?.length, error: openaiError });

      if (openaiError || !openaiData?.success) {
        console.error('❌ OpenAI search failed:', openaiError);
        
        return new Response(JSON.stringify({
          success: false,
          data: [],
          meta: {
            confidence: 0,
            sources: [],
            totalFound: 0,
            searchMethod: 'enhanced_no_results',
            error: openaiError?.message || 'No market listings found'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Store new listings in enhanced_market_listings (only if we have valid data)
      if (openaiData?.data?.length > 0) {
        const newListings = openaiData.data.map((listing: any) => ({
          vin: listing.vin,
          make: listing.make || searchParams.make,
          model: listing.model || searchParams.model,
          year: listing.year || searchParams.year,
          trim: listing.trim,
          price: listing.price,
          mileage: listing.mileage,
          condition: listing.condition || 'used',
          location: listing.location,
          zip_code: searchParams.zip,
          dealer_name: listing.dealerName,
          listing_url: listing.link || listing.listingUrl,
          source: listing.source,
          source_type: 'marketplace',
          is_cpo: listing.isCpo || false,
          confidence_score: listing.confidenceScore || 80,
          photos: listing.imageUrl ? [listing.imageUrl] : [],
          fetched_at: new Date().toISOString(),
          listing_status: 'active'
        }));

        // Insert new listings (ignore duplicates)
        const { error: insertError } = await supabase
          .from('enhanced_market_listings')
          .upsert(newListings, { onConflict: 'listing_url', ignoreDuplicates: true });

        if (insertError) {
          console.warn('⚠️ Failed to cache listings:', insertError);
        } else {
          console.log(`✅ Cached ${newListings.length} new listings`);
        }
      }

      return new Response(JSON.stringify({
        success: true,
        data: openaiData?.data || [],
        meta: {
          confidence: Math.min(90, 60 + ((openaiData?.data?.length || 0) * 3)),
          sources: openaiData?.meta?.sources || ['OpenAI Live Search'],
          totalFound: openaiData?.data?.length || 0,
          searchMethod: 'enhanced_live_search',
          cacheHit: false
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (invokeError) {
      console.error('❌ Edge function invoke failed:', invokeError);
      
      return new Response(JSON.stringify({
        success: false,
        data: [],
        meta: {
          confidence: 0,
          sources: [],
          totalFound: 0,
          searchMethod: 'enhanced_invoke_error',
          error: 'Failed to invoke market search function'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Enhanced market search error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: [],
      meta: {
        confidence: 0,
        sources: [],
        totalFound: 0,
        searchMethod: 'enhanced_error'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});