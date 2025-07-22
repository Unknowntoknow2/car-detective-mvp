
import { supabase } from '@/integrations/supabase/client';
import { MarketListing, normalizeListing } from '@/types/marketListing';

export interface MarketSearchInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  zipCode?: string;
  trim?: string;
  mileage?: number;
  radius?: number;
}

export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  console.log('🔍 Market search agent starting search:', input);
  
  const allListings: MarketListing[] = [];
  
  try {
    // Step 1: Try exact VIN match first (highest confidence)
    if (input.vin) {
      console.log('🎯 Searching for exact VIN matches...');
      const { data: vinMatches, error: vinError } = await supabase
        .from('enhanced_market_listings')
        .select('*')
        .eq('vin', input.vin)
        .eq('listing_status', 'active')
        .order('fetched_at', { ascending: false })
        .limit(10);
      
      if (!vinError && vinMatches && vinMatches.length > 0) {
        console.log(`✅ Found ${vinMatches.length} exact VIN matches`);
        allListings.push(...vinMatches.map(item => ({
          id: item.id,
          price: item.price,
          mileage: item.mileage,
          year: item.year,
          make: item.make,
          model: item.model,
          trim: item.trim,
          condition: item.condition,
          vin: item.vin,
          source: item.source,
          listing_url: item.listing_url,
          dealer_name: item.dealer_name,
          location: item.location,
          zip_code: item.zip_code,
          source_type: item.source_type,
          is_cpo: item.is_cpo,
          days_on_market: item.days_on_market,
          confidence_score: item.confidence_score,
          fetched_at: item.fetched_at,
          exterior_color: item.exterior_color,
          interior_color: item.interior_color,
          fuel_economy_city: item.fuel_economy_city,
          fuel_economy_highway: item.fuel_economy_highway,
          drivetrain: item.drivetrain,
          transmission_type: item.transmission_type,
          engine_description: item.engine_description,
          features: item.features,
          stock_number: item.stock_number
        })));
      }
    }
    
    // Step 2: Search for similar make/model/year listings
    console.log('🔄 Searching for similar make/model/year listings...');
    let query = supabase
      .from('enhanced_market_listings')
      .select('*')
      .eq('listing_status', 'active')
      .order('fetched_at', { ascending: false });
    
    // Apply filters
    if (input.make) query = query.ilike('make', `%${input.make}%`);
    if (input.model) query = query.ilike('model', `%${input.model}%`);
    if (input.year) {
      // Allow +/- 2 years for broader search
      query = query
        .gte('year', input.year - 2)
        .lte('year', input.year + 2);
    }
    
    // Add location filter if zipCode provided
    if (input.zipCode) {
      query = query.or(`zip_code.eq.${input.zipCode},geo_distance_miles.lte.${input.radius || 100}`);
    }
    
    // Limit results to prevent overwhelming response
    const { data: similarListings, error: similarError } = await query.limit(20);
    
    if (!similarError && similarListings && similarListings.length > 0) {
      console.log(`✅ Found ${similarListings.length} similar listings`);
      
      // Add similar listings, avoiding duplicates
      const existingVins = new Set(allListings.map(l => l.vin).filter(Boolean));
      const newListings = similarListings
        .filter(item => !item.vin || !existingVins.has(item.vin))
        .map(item => ({
          id: item.id,
          price: item.price,
          mileage: item.mileage,
          year: item.year,
          make: item.make,
          model: item.model,
          trim: item.trim,
          condition: item.condition,
          vin: item.vin,
          source: item.source,
          listing_url: item.listing_url,
          dealer_name: item.dealer_name,
          location: item.location,
          zip_code: item.zip_code,
          source_type: item.source_type,
          is_cpo: item.is_cpo,
          days_on_market: item.days_on_market,
          confidence_score: item.confidence_score,
          fetched_at: item.fetched_at,
          exterior_color: item.exterior_color,
          interior_color: item.interior_color,
          fuel_economy_city: item.fuel_economy_city,
          fuel_economy_highway: item.fuel_economy_highway,
          drivetrain: item.drivetrain,
          transmission_type: item.transmission_type,
          engine_description: item.engine_description,
          features: item.features,
          stock_number: item.stock_number
        }));
      
      allListings.push(...newListings);
    }
    
    // Step 3: Try to fetch live listings via edge function if we have few results
    if (allListings.length < 5) {
      console.log('🌐 Attempting to fetch live listings...');
      try {
        const { data: liveData, error: liveError } = await supabase.functions.invoke(
          'enhanced-market-search',
          {
            body: {
              make: input.make,
              model: input.model,
              year: input.year,
              zip: input.zipCode,
              exact: false
            }
          }
        );
        
        if (!liveError && liveData?.data && Array.isArray(liveData.data)) {
          console.log(`✅ Found ${liveData.data.length} live listings`);
          allListings.push(...liveData.data);
        }
      } catch (liveError) {
        console.warn('⚠️ Live listings fetch failed:', liveError);
      }
    }
    
    // Step 4: Normalize and filter results
    const normalizedListings = allListings
      .map(normalizeListing)
      .filter(listing => 
        listing.price > 1000 && 
        listing.price < 200000 &&
        listing.source !== 'unknown'
      )
      .sort((a, b) => {
        // Prioritize exact VIN matches and recent listings
        const aVinMatch = a.vin === input.vin ? 1 : 0;
        const bVinMatch = b.vin === input.vin ? 1 : 0;
        
        if (aVinMatch !== bVinMatch) {
          return bVinMatch - aVinMatch;
        }
        
        // Then sort by recency
        const aTime = new Date(a.fetched_at || a.fetchedAt || 0).getTime();
        const bTime = new Date(b.fetched_at || b.fetchedAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 15); // Limit to top 15 results
    
    console.log('🎯 Market search completed:', {
      totalListings: normalizedListings.length,
      exactVinMatches: normalizedListings.filter(l => l.vin === input.vin).length,
      sources: [...new Set(normalizedListings.map(l => l.source))],
      priceRange: normalizedListings.length > 0 ? {
        min: Math.min(...normalizedListings.map(l => l.price)),
        max: Math.max(...normalizedListings.map(l => l.price)),
        median: normalizedListings.map(l => l.price).sort((a, b) => a - b)[Math.floor(normalizedListings.length / 2)]
      } : null
    });
    
    return normalizedListings;
    
  } catch (error) {
    console.error('❌ Market search agent failed:', error);
    return [];
  }
}
