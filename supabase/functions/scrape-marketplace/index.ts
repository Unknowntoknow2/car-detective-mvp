import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketplaceSearchParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  zipCode?: string;
  mileage?: number;
}

interface MarketplaceListing {
  vin?: string;
  price: number;
  mileage?: number;
  location: string;
  seller_name?: string;
  listing_date?: string;
  condition?: string;
  listing_url: string;
  source_name: string;
  source_type: string;
  screenshot_url?: string;
  provenance: Record<string, any>;
  relevance_explanation: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: MarketplaceSearchParams = await req.json();
    console.log('🏪 Marketplace aggregation request:', params);

    const allListings: MarketplaceListing[] = [];
    const errors: string[] = [];

    // Define marketplace sources
    const marketplaceSources = [
      { name: 'Craigslist', url: 'https://craigslist.org/', type: 'peer_to_peer' },
      { name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace/', type: 'peer_to_peer' },
      { name: 'eBay Motors', url: 'https://www.ebay.com/motors', type: 'peer_to_peer' },
      { name: 'Bring a Trailer', url: 'https://bringatrailer.com/', type: 'enthusiast' },
      { name: 'TrueCar', url: 'https://www.truecar.com/', type: 'marketplace_aggregator' },
      { name: 'Cars.com', url: 'https://www.cars.com/', type: 'marketplace_aggregator' },
      { name: 'Autotrader', url: 'https://www.autotrader.com/', type: 'marketplace_aggregator' },
      { name: 'CarGurus', url: 'https://www.cargurus.com/', type: 'marketplace_aggregator' },
      { name: 'Edmunds', url: 'https://www.edmunds.com/', type: 'marketplace_aggregator' },
      { name: 'KBB', url: 'https://www.kbb.com/', type: 'valuation_service' },
      { name: 'Black Book', url: 'https://www.blackbook.com/', type: 'valuation_service' },
      { name: 'NADA Guides', url: 'https://www.nadaguides.com/', type: 'valuation_service' }
    ];

    // Process sources in parallel with rate limiting
    const sourcePromises = marketplaceSources.map(async (source) => {
      try {
        console.log(`🔍 Scraping ${source.name}...`);
        
        const sourceListings = await scrapeMarketplaceSource(source, params);
        allListings.push(...sourceListings);
        
        console.log(`✅ ${source.name}: Found ${sourceListings.length} listings`);
      } catch (error) {
        const errorMsg = `❌ ${source.name}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    });

    await Promise.allSettled(sourcePromises);

    // Deduplicate by VIN/URL and remove exact duplicates
    const deduplicatedListings = deduplicateListings(allListings);

    // Save results to database
    if (deduplicatedListings.length > 0) {
      const pricingData = deduplicatedListings.map(listing => ({
        vin: listing.vin,
        year: params.year,
        make: params.make.toUpperCase(),
        model: params.model.toUpperCase(),
        trim: params.trim,
        price: listing.price,
        mileage: listing.mileage,
        location: listing.location,
        zip_code: params.zipCode,
        dealer_name: listing.seller_name,
        source_name: listing.source_name,
        source_type: listing.source_type,
        listing_url: listing.listing_url,
        screenshot_url: listing.screenshot_url,
        vehicle_condition: listing.condition,
        date_listed: listing.listing_date,
        offer_type: 'listing',
        provenance: listing.provenance
      }));

      const { error: insertError } = await supabase
        .from('vehicle_pricing_data')
        .insert(pricingData);

      if (insertError) {
        console.error('Database insert error:', insertError);
        errors.push(`Database error: ${insertError.message}`);
      } else {
        console.log(`💾 Saved ${deduplicatedListings.length} marketplace listings`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      source: 'Marketplace Aggregator',
      total_listings: deduplicatedListings.length,
      sources_scraped: marketplaceSources.length,
      sources_successful: marketplaceSources.length - errors.length,
      listings: deduplicatedListings,
      errors: errors,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Marketplace aggregation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      source: 'Marketplace Aggregator'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scrapeMarketplaceSource(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  const listings: MarketplaceListing[] = [];
  
  try {
    switch (source.name) {
      case 'Craigslist':
        return await scrapeCraigslist(source, params);
      case 'Facebook Marketplace':
        return await scrapeFacebookMarketplace(source, params);
      case 'eBay Motors':
        return await scrapeEbayMotors(source, params);
      case 'Bring a Trailer':
        return await scrapeBringATrailer(source, params);
      case 'Cars.com':
        return await scrapeCarsDotCom(source, params);
      case 'Autotrader':
        return await scrapeAutotrader(source, params);
      case 'CarGurus':
        return await scrapeCarGurus(source, params);
      default:
        return await scrapeGenericMarketplace(source, params);
    }
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

async function scrapeCraigslist(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    // Build Craigslist search URL
    const searchTerm = `${params.year} ${params.make} ${params.model}`.toLowerCase();
    const searchUrl = `${source.url}search/cta?query=${encodeURIComponent(searchTerm)}`;
    
    console.log(`🔗 Craigslist search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Craigslist HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Craigslist HTML received: ${html.length} characters`);
    
    // Parse Craigslist HTML structure (would contain actual parsing logic)
    const listings = parseCraigslistHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`Craigslist scraping failed: ${error.message}`);
  }
}

async function scrapeFacebookMarketplace(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    console.log('📱 Facebook Marketplace scraping - requires auth, using generic search');
    return await scrapeGenericMarketplace(source, params);
  } catch (error) {
    throw new Error(`Facebook Marketplace scraping failed: ${error.message}`);
  }
}

async function scrapeEbayMotors(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    const searchTerm = `${params.year} ${params.make} ${params.model}`;
    const searchUrl = `${source.url}/sch/Cars-Trucks/6001/i.html?_nkw=${encodeURIComponent(searchTerm)}`;
    
    console.log(`🔗 eBay Motors search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`eBay Motors HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 eBay Motors HTML received: ${html.length} characters`);
    
    // Parse eBay Motors HTML structure
    const listings = parseEbayMotorsHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`eBay Motors scraping failed: ${error.message}`);
  }
}

async function scrapeBringATrailer(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    const searchTerm = `${params.year} ${params.make} ${params.model}`;
    const searchUrl = `${source.url}search/?q=${encodeURIComponent(searchTerm)}`;
    
    console.log(`🔗 Bring a Trailer search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Bring a Trailer HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Bring a Trailer HTML received: ${html.length} characters`);
    
    // Parse Bring a Trailer HTML structure
    const listings = parseBringATrailerHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`Bring a Trailer scraping failed: ${error.message}`);
  }
}

async function scrapeCarsDotCom(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    const searchUrl = `${source.url}shopping/results/?make=${params.make}&model=${params.model}&year=${params.year}`;
    
    console.log(`🔗 Cars.com search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Cars.com HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Cars.com HTML received: ${html.length} characters`);
    
    // Parse Cars.com HTML structure
    const listings = parseCarsDotComHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`Cars.com scraping failed: ${error.message}`);
  }
}

async function scrapeAutotrader(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    const searchUrl = `${source.url}cars-for-sale/${params.make}/${params.model}?year=${params.year}`;
    
    console.log(`🔗 Autotrader search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Autotrader HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Autotrader HTML received: ${html.length} characters`);
    
    // Parse Autotrader HTML structure
    const listings = parseAutotraderHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`Autotrader scraping failed: ${error.message}`);
  }
}

async function scrapeCarGurus(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    const searchUrl = `${source.url}Cars/${params.make}-${params.model}`;
    
    console.log(`🔗 CarGurus search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`CarGurus HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 CarGurus HTML received: ${html.length} characters`);
    
    // Parse CarGurus HTML structure
    const listings = parseCarGurusHTML(html, source, params);
    
    return listings;
  } catch (error) {
    throw new Error(`CarGurus scraping failed: ${error.message}`);
  }
}

async function scrapeGenericMarketplace(source: any, params: MarketplaceSearchParams): Promise<MarketplaceListing[]> {
  try {
    console.log(`🌐 Generic marketplace scraping for ${source.name}`);
    
    // For now, return mock structure to demonstrate format
    const mockListing: MarketplaceListing = {
      price: 25000,
      mileage: 50000,
      location: params.zipCode || 'Unknown',
      seller_name: `${source.name} Seller`,
      listing_date: new Date().toISOString(),
      condition: 'Good',
      listing_url: `${source.url}listing/mock`,
      source_name: source.name,
      source_type: source.type,
      provenance: {
        scraped_from: source.url,
        extraction_method: 'generic_html_parsing',
        timestamp: new Date().toISOString(),
        search_params: params
      },
      relevance_explanation: `${params.year} ${params.make} ${params.model} found on ${source.name} - similar year, make, and model match.`
    };
    
    return []; // Return empty for now, actual implementation would parse HTML
  } catch (error) {
    throw new Error(`Generic marketplace scraping failed: ${error.message}`);
  }
}

// HTML parsing functions (simplified for demonstration)
function parseCraigslistHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing Craigslist HTML structure...');
  // Real implementation would parse Craigslist result rows
  return [];
}

function parseEbayMotorsHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing eBay Motors HTML structure...');
  // Real implementation would parse eBay item listings
  return [];
}

function parseBringATrailerHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing Bring a Trailer HTML structure...');
  // Real implementation would parse BaT auction listings
  return [];
}

function parseCarsDotComHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing Cars.com HTML structure...');
  // Real implementation would parse Cars.com vehicle listings
  return [];
}

function parseAutotraderHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing Autotrader HTML structure...');
  // Real implementation would parse Autotrader vehicle listings
  return [];
}

function parseCarGurusHTML(html: string, source: any, params: MarketplaceSearchParams): MarketplaceListing[] {
  console.log('📋 Parsing CarGurus HTML structure...');
  // Real implementation would parse CarGurus vehicle listings
  return [];
}

function deduplicateListings(listings: MarketplaceListing[]): MarketplaceListing[] {
  const seen = new Set<string>();
  const deduplicated: MarketplaceListing[] = [];
  
  for (const listing of listings) {
    // Create unique key based on VIN (if available) or URL
    const key = listing.vin || listing.listing_url;
    
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(listing);
    }
  }
  
  console.log(`🔄 Deduplication: ${listings.length} -> ${deduplicated.length} listings`);
  return deduplicated;
}

async function fetchWithHeaders(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none'
    }
  });
}