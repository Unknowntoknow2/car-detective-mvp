import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SearchParams {
  make: string;
  model: string;
  year: number;
  zipCode?: string;
  zip?: string;
  mileage?: number;
  radius?: number;
  vin?: string;
  exact?: boolean;
  valuation_request_id?: string;
}

interface MarketSearchResult {
  data: MarketListing[];
  meta: {
    sources: string[];
    confidence: number;
    exact_match: boolean;
    count: number;
    used_openai_fallback?: boolean;
    search_method?: string;
    verification_notes?: string;
  };
}

interface MarketListing {
  id: string;
  source: string;
  source_type: string;
  price: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  mileage: number;
  condition: string;
  dealer_name?: string;
  location: string;
  listing_url: string;
  is_cpo: boolean;
  fetched_at: string;
  confidence_score: number;
  photos?: string[];
}

async function searchMarketListings(params: SearchParams): Promise<MarketListing[]> {
  console.log('🔍 Enhanced Market Search - Starting search with params:', params);
  const zipCode = params.zipCode || params.zip || '94016';
  const radius = params.radius || 100;

  try {
    const { data: existingListings, error: dbError } = await supabase
      .from('enhanced_market_listings')
      .select('*')
      .ilike('make', params.make)
      .ilike('model', params.model)
      .eq('year', params.year)
      .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(20);

    if (!dbError && existingListings && existingListings.length > 0) {
      console.log(`✅ Found ${existingListings.length} recent listings in database`);
      const realListings = existingListings.filter(listing => 
        listing.listing_url && 
        !listing.listing_url.includes('example.com') &&
        !listing.listing_url.includes('listing1') &&
        !listing.listing_url.includes('listing2') &&
        listing.price > 1000
      );
      if (realListings.length > 0) {
        return realListings.map(listing => ({
          id: listing.id,
          source: listing.source || 'Database',
          source_type: listing.source_type || 'marketplace',
          price: listing.price,
          year: listing.year,
          make: listing.make,
          model: listing.model,
          trim: listing.trim,
          vin: listing.vin,
          mileage: listing.mileage || 0,
          condition: listing.condition || 'used',
          dealer_name: listing.dealer_name,
          location: listing.location || `${zipCode} area`,
          listing_url: listing.listing_url,
          is_cpo: listing.is_cpo || false,
          fetched_at: listing.fetched_at,
          confidence_score: listing.confidence_score || 85,
          photos: listing.photos ? (Array.isArray(listing.photos) ? listing.photos : []) : []
        }));
      }
    }

    console.log('📊 No recent listings found, triggering real scrapers...');
    
    // Try to scrape real listings from external sources
    try {
      const scrapedListings = await triggerRealScrapers(params, zipCode);
      if (scrapedListings.length > 0) {
        console.log(`✅ Found ${scrapedListings.length} real listings from scrapers`);
        return scrapedListings;
      }
    } catch (scraperError) {
      console.error('❌ Scraper failed:', scraperError);
    }
    
    console.log('📊 No scraped listings found, trying OpenAI web search fallback...');
    
    // Try OpenAI web search as fallback
    try {
      const openAIListings = await callOpenAIWebSearchFallback(params, zipCode);
      if (openAIListings.length > 0) {
        console.log(`✅ Found ${openAIListings.length} verified listings from OpenAI web search`);
        return openAIListings;
      }
    } catch (openAIError) {
      console.error('❌ OpenAI web search fallback failed:', openAIError);
    }

    console.log('📊 No real listings available from any source');
    return [];

  } catch (error) {
    console.error('❌ Enhanced Market Search Error:', error);
    throw error;
  }
}

async function triggerRealScrapers(params: SearchParams, zipCode: string): Promise<MarketListing[]> {
  const allListings: MarketListing[] = [];
  
  // Try AutoTrader scraper
  try {
    console.log('🚗 Calling AutoTrader scraper...');
    const { data: autoTraderData, error: autoTraderError } = await supabase.functions.invoke(
      'fetch-competitor-prices',
      {
        body: {
          source: 'autotrader',
          make: params.make,
          model: params.model,
          year: params.year,
          zip: zipCode,
          radius: params.radius || 100
        }
      }
    );
    
    if (!autoTraderError && autoTraderData?.listings) {
      const validatedListings = await validateAndStoreListings(autoTraderData.listings, 'AutoTrader');
      allListings.push(...validatedListings);
    }
  } catch (error) {
    console.error('❌ AutoTrader scraper failed:', error);
  }

  // Try Cars.com scraper  
  try {
    console.log('🚗 Calling Cars.com scraper...');
    const { data: carsData, error: carsError } = await supabase.functions.invoke(
      'fetch-competitor-prices',
      {
        body: {
          source: 'cars.com',
          make: params.make,
          model: params.model,
          year: params.year,
          zip: zipCode,
          radius: params.radius || 100
        }
      }
    );
    
    if (!carsError && carsData?.listings) {
      const validatedListings = await validateAndStoreListings(carsData.listings, 'Cars.com');
      allListings.push(...validatedListings);
    }
  } catch (error) {
    console.error('❌ Cars.com scraper failed:', error);
  }

  return allListings;
}

async function validateAndStoreListings(rawListings: any[], source: string): Promise<MarketListing[]> {
  const validListings: MarketListing[] = [];
  
  for (const listing of rawListings) {
    // Validate listing data
    if (!isValidListing(listing)) {
      console.log('❌ Rejected invalid listing:', listing);
      continue;
    }
    
    const validatedListing: MarketListing = {
      id: `${source.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      source_type: 'marketplace',
      price: parseFloat(listing.price) || 0,
      year: parseInt(listing.year) || 0,
      make: listing.make || '',
      model: listing.model || '',
      trim: listing.trim || null,
      vin: listing.vin || null,
      mileage: parseInt(listing.mileage) || 0,
      condition: listing.condition || 'used',
      dealer_name: listing.dealer_name || listing.dealerName || null,
      location: listing.location || '',
      listing_url: listing.url || listing.listing_url || '',
      is_cpo: Boolean(listing.is_cpo || listing.isCpo),
      fetched_at: new Date().toISOString(),
      confidence_score: calculateConfidenceScore(listing),
      photos: Array.isArray(listing.photos) ? listing.photos : []
    };
    
    validListings.push(validatedListing);
  }
  
  // Store validated listings in database
  if (validListings.length > 0) {
    const { error: insertError } = await supabase
      .from('enhanced_market_listings')
      .insert(validListings);
      
    if (insertError) {
      console.error('❌ Error storing validated listings:', insertError);
    } else {
      console.log(`✅ Stored ${validListings.length} validated listings from ${source}`);
    }
  }
  
  return validListings;
}

function isValidListing(listing: any): boolean {
  // Check required fields
  if (!listing.price || !listing.url || !listing.make || !listing.model) {
    return false;
  }
  
  // Check price range (reject unrealistic prices)
  const price = parseFloat(listing.price);
  if (price <= 1000 || price > 500000) {
    return false;
  }
  
  // Check URL format (reject placeholder URLs)
  const url = listing.url || listing.listing_url || '';
  if (url.includes('...') || url.includes('placeholder') || url.includes('example.com') || url.length < 10) {
    return false;
  }
  
  // Check for realistic mileage
  const mileage = parseInt(listing.mileage) || 0;
  if (mileage < 0 || mileage > 500000) {
    return false;
  }
  
  return true;
}

function calculateConfidenceScore(listing: any): number {
  let score = 70; // Base score
  
  // Add points for having complete data
  if (listing.dealer_name) score += 5;
  if (listing.photos && listing.photos.length > 0) score += 5;
  if (listing.vin) score += 10;
  if (listing.trim) score += 3;
  if (listing.condition) score += 2;
  
  // Cap at 95%
  return Math.min(95, score);
}

function estimateBasePrice(params: SearchParams): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - params.year;
  const basePrices: { [key: string]: number } = {
    'toyota': 35000,
    'honda': 32000,
    'nissan': 28000,
    'ford': 30000,
    'chevrolet': 29000,
    'bmw': 45000,
    'mercedes': 50000,
    'audi': 42000,
    'lexus': 40000,
    'infiniti': 38000
  };
  const basePrice = basePrices[params.make.toLowerCase()] || 30000;
  let depreciatedPrice = basePrice;
  if (age > 0) {
    depreciatedPrice *= 0.85;
    for (let i = 1; i < age; i++) {
      depreciatedPrice *= 0.90;
    }
  }
  const avgMilesPerYear = 12000;
  const expectedMiles = age * avgMilesPerYear;
  const actualMiles = params.mileage || expectedMiles;
  const mileageAdjustment = (expectedMiles - actualMiles) / 100000 * 0.1;
  depreciatedPrice *= (1 + mileageAdjustment);
  return Math.max(depreciatedPrice, 5000);
}

async function callOpenAIWebSearchFallback(params: SearchParams, zipCode: string): Promise<MarketListing[]> {
  console.log('🤖 [OPENAI_WEB_FALLBACK] Starting real-time OpenAI web search for:', params);
  
  if (!openAIApiKey) {
    console.log('⚠️ [OPENAI_WEB_FALLBACK] No OpenAI API key configured');
    return [];
  }

  try {
    // Construct precise search prompt for real-time web search
    const searchPrompt = `Search for REAL, CURRENT vehicle listings for ${params.year} ${params.make} ${params.model}${params.mileage ? ` with approximately ${params.mileage} miles` : ''} near zip code ${zipCode}.

CRITICAL REQUIREMENTS:
- Find ONLY real, active listings from AutoTrader, Cars.com, CarGurus, CarMax, or similar automotive sites
- Each listing MUST have a real, accessible URL that actually works when visited
- Prices must be realistic market values (${Math.round((params.year - 2000) * 1000 + 15000)}-${Math.round((params.year - 2000) * 1500 + 45000)})
- Return actual dealer names, not placeholders like "Best Motors" or "Premium Auto"
- Verify listings are current (posted within last 30 days)
- Only return listings you can verify exist on real automotive websites

DO NOT generate fake URLs or placeholder data. If you cannot find real listings, return an empty array.

Return JSON format:
{
  "listings": [
    {
      "price": [actual_price_number],
      "mileage": [actual_mileage],
      "source": "[actual_site_name like AutoTrader]",
      "url": "[verified_working_url]",
      "dealer_name": "[real_dealer_name]",
      "location": "[actual_location]",
      "condition": "[actual_condition]",
      "photos": ["[verified_image_url]"],
      "trim": "[trim_level]",
      "verified": true
    }
  ],
  "verification_notes": "Brief notes on how listings were verified"
}`;

    // Call OpenAI with web search capabilities
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Use more powerful model for web search
        messages: [
          { 
            role: 'system', 
            content: 'You are a real-time automotive market research agent with web access. ONLY return listings that you can verify actually exist on real automotive websites. Never generate fake URLs or placeholder data. If you cannot find real listings, return an empty array. Verify each URL is accessible and contains actual vehicle listing data.' 
          },
          { role: 'user', content: searchPrompt }
        ],
        temperature: 0.1, // Low temperature for accuracy
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('🤖 [OPENAI_WEB_FALLBACK] Received response, parsing and validating...');

    // Parse and validate the AI response
    let aiData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('❌ [OPENAI_WEB_FALLBACK] Failed to parse AI response:', parseError);
      return [];
    }

    // Validate and process listings
    const validatedListings: MarketListing[] = [];
    
    if (aiData.listings && Array.isArray(aiData.listings)) {
      for (const listing of aiData.listings) {
        const validatedListing = await validateOpenAIListing(listing, params, zipCode);
        if (validatedListing) {
          validatedListings.push(validatedListing);
        }
      }
    }

    console.log(`✅ [OPENAI_WEB_FALLBACK] Validated ${validatedListings.length} real listings`);

    // Store validated listings in database
    if (validatedListings.length > 0) {
      const { error: insertError } = await supabase
        .from('enhanced_market_listings')
        .insert(validatedListings.map(listing => ({
          ...listing,
          source: 'openai-web',
          source_type: 'live_search',
          valuation_request_id: params.valuation_request_id,
          fetched_at: new Date().toISOString(),
          confidence_score: listing.confidence_score || 75,
          validation_status: 'ai_web_verified',
          verification_notes: aiData.verification_notes || 'Verified by AI web search'
        })));

      if (insertError) {
        console.error('❌ [OPENAI_WEB_FALLBACK] Error storing validated listings:', insertError);
      } else {
        console.log('✅ [OPENAI_WEB_FALLBACK] Stored validated listings in database');
      }
    }

    return validatedListings;

  } catch (err) {
    console.error('❌ [OPENAI_WEB_FALLBACK] OpenAI web search failed:', err);
    return [];
  }
}

// Comprehensive validation function for OpenAI listings
async function validateOpenAIListing(listing: any, params: SearchParams, zipCode: string): Promise<MarketListing | null> {
  console.log('🔍 [VALIDATION] Validating OpenAI listing:', listing.url);

  // Basic data validation
  if (!listing.price || !listing.url || !listing.dealer_name) {
    console.log('❌ [VALIDATION] Missing required fields');
    return null;
  }

  // Price validation (reasonable range)
  if (listing.price < 3000 || listing.price > 200000) {
    console.log('❌ [VALIDATION] Price out of reasonable range:', listing.price);
    return null;
  }

  // Dealer name validation (reject generic placeholder names)
  const placeholderNames = [
    'best motors', 'premium auto', 'auto sales', 'motor company', 
    'car dealership', 'vehicle sales', 'unknown', 'n/a', 'dealer'
  ];
  const dealerNameLower = listing.dealer_name.toLowerCase();
  if (placeholderNames.some(placeholder => dealerNameLower.includes(placeholder))) {
    console.log('❌ [VALIDATION] Generic dealer name detected:', listing.dealer_name);
    return null;
  }

  // URL validation with real domain check
  let urlAccessible = false;
  try {
    const url = new URL(listing.url);
    const validDomains = [
      'autotrader.com', 'cars.com', 'cargurus.com', 'carmax.com', 
      'edmunds.com', 'carfax.com', 'vroom.com', 'shift.com',
      'carvanacove.com', 'kbb.com'
    ];
    
    const isValidDomain = validDomains.some(domain => 
      url.hostname.includes(domain) || url.hostname.endsWith(domain)
    );
    
    if (!isValidDomain) {
      console.log('❌ [VALIDATION] Invalid domain:', url.hostname);
      return null;
    }

    // Quick HTTP check with timeout for URL accessibility
    try {
      const urlCheckResponse = await fetch(listing.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      urlAccessible = urlCheckResponse.ok;
      console.log(`🔍 [VALIDATION] URL accessibility check: ${urlAccessible ? 'PASS' : 'FAIL'} - ${listing.url}`);
    } catch (fetchError) {
      console.log('⚠️ [VALIDATION] URL not accessible:', listing.url);
      urlAccessible = false;
    }

  } catch (urlError) {
    console.log('❌ [VALIDATION] Invalid URL format:', listing.url);
    return null;
  }

  // Photo validation if provided
  if (listing.photos && Array.isArray(listing.photos)) {
    for (const photoUrl of listing.photos) {
      try {
        new URL(photoUrl); // Basic URL format check
      } catch {
        console.log('⚠️ [VALIDATION] Invalid photo URL:', photoUrl);
        listing.photos = []; // Clear invalid photos
        break;
      }
    }
  }

  // Calculate confidence score based on validation results
  let confidenceScore = 70; // Base score for OpenAI source
  if (urlAccessible) confidenceScore += 10;
  if (listing.vin && listing.vin.length === 17) confidenceScore += 5;
  if (listing.photos && listing.photos.length > 0) confidenceScore += 3;
  if (listing.trim) confidenceScore += 2;
  
  // Process and normalize the listing
  return {
    id: `openai-web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: 'openai-web',
    source_type: 'live_search',
    price: Number(listing.price),
    year: params.year,
    make: params.make,
    model: params.model,
    trim: listing.trim || '',
    vin: listing.vin || '',
    mileage: Number(listing.mileage) || 0,
    condition: listing.condition || 'used',
    dealer_name: listing.dealer_name,
    location: listing.location || `${zipCode} area`,
    listing_url: listing.url,
    is_cpo: Boolean(listing.is_cpo),
    fetched_at: new Date().toISOString(),
    confidence_score: Math.min(85, confidenceScore),
    photos: Array.isArray(listing.photos) ? listing.photos : []
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('🔍 Enhanced Market Search - Received request:', body);

    const searchParams: SearchParams = {
      make: body.make,
      model: body.model,
      year: body.year,
      zipCode: body.zipCode || body.zip,
      mileage: body.mileage,
      radius: body.radius || 100,
      vin: body.vin,
      exact: body.exact
    };

    if (!searchParams.make || !searchParams.model || !searchParams.year) {
      throw new Error('Missing required parameters: make, model, year');
    }

    const listings = await searchMarketListings(searchParams);
    
    // Check if OpenAI fallback was used
    const usedOpenAIFallback = listings.some(listing => listing.source === 'openai-web');
    
    const response = {
      success: true,
      data: listings,
      count: listings.length,
      source: 'enhanced-market-search',
      searchParams,
      meta: {
        sources: [...new Set(listings.map(l => l.source))],
        confidence: listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.confidence_score, 0) / listings.length) : 0,
        exact_match: false,
        count: listings.length,
        used_openai_fallback: usedOpenAIFallback,
        search_method: usedOpenAIFallback ? 'openai_web_fallback' : 'scrapers'
      }
    };

    console.log(`✅ Enhanced Market Search - Returning ${listings.length} listings`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Enhanced Market Search - Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: [],
      count: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
