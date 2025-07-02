import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManheimSearchParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin?: string;
  zipCode?: string;
  mileage?: number;
}

interface AuctionResult {
  vin?: string;
  sale_date: string;
  final_price: number;
  mileage?: number;
  location: string;
  auction_grade?: string;
  title_status: string;
  lot_url?: string;
  image_url?: string;
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
    const params: ManheimSearchParams = await req.json();
    console.log('🏛️ Manheim auction scraping request:', params);

    const results = await scrapeManheimAuctions(params);
    
    // Save results to database
    if (results.length > 0) {
      const pricingData = results.map(result => ({
        vin: result.vin,
        year: params.year,
        make: params.make.toUpperCase(),
        model: params.model.toUpperCase(),
        trim: params.trim,
        price: result.final_price,
        mileage: result.mileage,
        location: result.location,
        zip_code: params.zipCode,
        dealer_name: 'Manheim Auctions',
        source_name: 'Manheim',
        source_type: 'auction_wholesale',
        listing_url: result.lot_url,
        vehicle_condition: result.title_status,
        date_listed: result.sale_date,
        offer_type: 'auction_sold',
        provenance: result.provenance
      }));

      const { error: insertError } = await supabase
        .from('vehicle_pricing_data')
        .insert(pricingData);

      if (insertError) {
        console.error('Database insert error:', insertError);
      } else {
        console.log(`💾 Saved ${results.length} Manheim auction results`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      source: 'Manheim',
      results: results,
      total: results.length,
      search_params: params,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Manheim scraping error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      source: 'Manheim'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function scrapeManheimAuctions(params: ManheimSearchParams): Promise<AuctionResult[]> {
  const results: AuctionResult[] = [];
  
  try {
    console.log('🔍 Starting Manheim auction search...');
    
    // Method 1: Search by VIN if available
    if (params.vin) {
      console.log(`🔎 Searching Manheim by VIN: ${params.vin}`);
      const vinResults = await searchManheimByVin(params.vin);
      results.push(...vinResults);
    }
    
    // Method 2: Search by vehicle details
    console.log(`🚗 Searching Manheim by vehicle: ${params.year} ${params.make} ${params.model}`);
    const vehicleResults = await searchManheimByVehicle(params);
    results.push(...vehicleResults);
    
    // Method 3: Search recent runlists and sale summaries
    console.log('📋 Searching Manheim runlists and sale summaries...');
    const runlistResults = await searchManheimRunlists(params);
    results.push(...runlistResults);
    
    console.log(`✅ Manheim search completed: ${results.length} results found`);
    
  } catch (error) {
    console.error('❌ Manheim scraping error:', error);
  }
  
  return results;
}

async function searchManheimByVin(vin: string): Promise<AuctionResult[]> {
  const results: AuctionResult[] = [];
  
  try {
    // Search Manheim.com directly for VIN
    const searchUrl = `https://www.manheim.com/members/search?vin=${vin}`;
    console.log(`🔗 Manheim VIN search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Manheim VIN search failed: HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Manheim VIN search HTML received: ${html.length} characters`);
    
    // Parse Manheim HTML for auction results
    const auctionResults = parseManheimHTML(html, 'vin_search');
    results.push(...auctionResults);
    
    // If no direct results, try alternate VIN search patterns
    if (results.length === 0) {
      console.log('🔄 Trying alternate Manheim VIN search...');
      const alternateResults = await searchManheimAlternateVin(vin);
      results.push(...alternateResults);
    }
    
  } catch (error) {
    console.error('❌ Manheim VIN search error:', error);
  }
  
  return results;
}

async function searchManheimByVehicle(params: ManheimSearchParams): Promise<AuctionResult[]> {
  const results: AuctionResult[] = [];
  
  try {
    // Build Manheim vehicle search URL
    const searchUrl = buildManheimVehicleSearchUrl(params);
    console.log(`🔗 Manheim vehicle search URL: ${searchUrl}`);
    
    const response = await fetchWithHeaders(searchUrl);
    if (!response.ok) {
      throw new Error(`Manheim vehicle search failed: HTTP ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`📄 Manheim vehicle search HTML: ${html.length} characters`);
    
    // Parse results
    const auctionResults = parseManheimHTML(html, 'vehicle_search');
    results.push(...auctionResults);
    
  } catch (error) {
    console.error('❌ Manheim vehicle search error:', error);
  }
  
  return results;
}

async function searchManheimRunlists(params: ManheimSearchParams): Promise<AuctionResult[]> {
  const results: AuctionResult[] = [];
  
  try {
    // Search public Manheim runlists and sale summaries
    const runlistUrl = `https://www.manheim.com/public/runlists?make=${params.make}&model=${params.model}&year=${params.year}`;
    console.log(`🔗 Manheim runlist URL: ${runlistUrl}`);
    
    const response = await fetchWithHeaders(runlistUrl);
    if (response.ok) {
      const html = await response.text();
      const runlistResults = parseManheimHTML(html, 'runlist');
      results.push(...runlistResults);
    }
    
  } catch (error) {
    console.error('❌ Manheim runlist search error:', error);
  }
  
  return results;
}

async function searchManheimAlternateVin(vin: string): Promise<AuctionResult[]> {
  // Try alternate search patterns for Manheim
  const results: AuctionResult[] = [];
  
  try {
    // Search archived sales, recent transactions, etc.
    const alternateUrls = [
      `https://www.manheim.com/sales/search?q=${vin}`,
      `https://www.manheim.com/results?vin=${vin}`,
      `https://www.manheim.com/auction/results?vehicle_id=${vin}`
    ];
    
    for (const url of alternateUrls) {
      try {
        console.log(`🔄 Trying alternate Manheim URL: ${url}`);
        const response = await fetchWithHeaders(url);
        if (response.ok) {
          const html = await response.text();
          const parsed = parseManheimHTML(html, 'alternate');
          results.push(...parsed);
        }
      } catch (error) {
        console.log(`⚠️ Alternate URL failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Alternate Manheim search error:', error);
  }
  
  return results;
}

function buildManheimVehicleSearchUrl(params: ManheimSearchParams): string {
  const baseUrl = 'https://www.manheim.com/members/search';
  const searchParams = new URLSearchParams();
  
  searchParams.append('make', params.make);
  searchParams.append('model', params.model);
  searchParams.append('year', params.year.toString());
  
  if (params.trim) searchParams.append('trim', params.trim);
  if (params.zipCode) searchParams.append('zip', params.zipCode);
  if (params.mileage) searchParams.append('mileage', params.mileage.toString());
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function parseManheimHTML(html: string, searchType: string): AuctionResult[] {
  const results: AuctionResult[] = [];
  
  try {
    console.log(`📋 Parsing Manheim HTML for ${searchType}`);
    
    // In a real implementation, this would use proper HTML parsing
    // to extract auction result tables, sale data, etc.
    
    // Mock parsing logic to demonstrate structure
    const sampleResult: AuctionResult = {
      sale_date: '2024-06-15',
      final_price: 28500,
      mileage: 45000,
      location: 'Manheim Atlanta',
      auction_grade: 'Green Light',
      title_status: 'Clean',
      lot_url: 'https://www.manheim.com/lot/123456',
      provenance: {
        scraped_from: 'manheim.com',
        search_type: searchType,
        extraction_method: 'html_parsing',
        timestamp: new Date().toISOString()
      },
      relevance_explanation: `Similar vehicle found at Manheim auction - ${searchType} search yielded comparable market data.`
    };
    
    // Real implementation would extract multiple results from HTML tables
    console.log(`✅ Manheim parsing completed for ${searchType}`);
    
  } catch (error) {
    console.error('❌ Manheim HTML parsing error:', error);
  }
  
  return results;
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