import { supabase } from "@/integrations/supabase/client";
import type { MarketListing } from "@/types/valuation";
import { toast } from "sonner";

/**
 * Enhanced marketplace listings fetcher with real data integration
 */
export const fetchMarketplaceListings = async (
  make: string,
  model: string,
  year: number,
  zipCode: string,
  vin?: string
): Promise<MarketListing[]> => {
  try {
    console.log('Fetching marketplace listings:', { make, model, year, zipCode, vin });
    
    // Use the enhanced market listing service for real data
    const { EnhancedMarketListingService } = await import('./enhancedMarketListingService');
    
    const realListings = await EnhancedMarketListingService.fetchRealMarketListings({
      vin,
      make,
      model,
      year,
      zipCode,
      maxResults: 20
    });

    if (realListings.length === 0) {
      console.log('No real listings found, trying enhanced market search edge function');
      
      // Try the new enhanced market search edge function
      const { data: enhancedData, error: enhancedError } = await supabase.functions.invoke('enhanced-market-search', {
        body: {
          make,
          model,
          year,
          zipCode,
          vin
        }
      });

      if (!enhancedError && enhancedData?.listings) {
        console.log(`Found ${enhancedData.listings.length} listings from enhanced search`);
        
        // Transform enhanced listings to MarketListing format
        const enhancedListings: MarketListing[] = enhancedData.listings.map((listing: any) => ({
          id: listing.id || `enhanced-${Date.now()}-${Math.random()}`,
          source: listing.source,
          source_type: 'marketplace',
          price: listing.price,
          year: listing.year || year,
          make: listing.make || make,
          model: listing.model || model,
          trim: listing.trim,
          vin: listing.vin,
          mileage: listing.mileage,
          condition: listing.condition || 'used',
          dealer_name: listing.dealer_name,
          location: listing.location || zipCode,
          listing_url: listing.listing_url,
          is_cpo: listing.is_cpo || false,
          fetched_at: listing.fetched_at || new Date().toISOString(),
          confidence_score: listing.confidence_score || 85
        }));

        return enhancedListings;
      }
      
      // Fallback to original edge function
      console.log('Falling back to original fetch-marketplace-data');
      const { data, error } = await supabase.functions.invoke('fetch-marketplace-data', {
        body: {
          make,
          model,
          year,
          zipCode,
          vin
        }
      });

      if (error) {
        console.error('Error calling marketplace data function:', error);
        toast.error('Failed to fetch market data');
        return [];
      }

      if (!data || !data.listings) {
        console.log('No listings found in fallback response');
        return [];
      }

      // Transform fallback response
      const fallbackListings: MarketListing[] = data.listings.map((item: any) => ({
        id: item.id || `listing-${Date.now()}-${Math.random()}`,
        source: item.platform || item.source || 'marketplace',
        source_type: 'marketplace',
        price: parseFloat(item.price?.toString().replace(/[^0-9.]/g, '') || '0'),
        year: item.year || year,
        make: item.make || make,
        model: item.model || model,
        trim: item.trim,
        vin: item.vin,
        mileage: item.mileage ? parseInt(item.mileage.toString().replace(/[^0-9]/g, '')) : undefined,
        condition: item.condition || 'used',
        dealer_name: item.dealer_name,
        location: item.location || zipCode,
        listing_url: item.url || item.listing_url || '#',
        is_cpo: item.is_cpo || false,
        fetched_at: item.created_at || new Date().toISOString(),
        confidence_score: item.confidence_score || 75
      }));

      console.log(`Processed ${fallbackListings.length} fallback listings`);
      return fallbackListings;
    }

    // Transform real enhanced listings to MarketListing format
    const transformedListings: MarketListing[] = realListings.map((listing) => ({
      id: listing.id || `enhanced-${Date.now()}-${Math.random()}`,
      source: listing.source,
      source_type: listing.source_type || 'marketplace',
      price: listing.price,
      year: listing.year || year,
      make: listing.make || make,
      model: listing.model || model,
      trim: listing.trim,
      vin: listing.vin,
      mileage: listing.mileage,
      condition: listing.condition || 'used',
      dealer_name: listing.dealer_name,
      location: listing.location || zipCode,
      listing_url: listing.listing_url,
      is_cpo: listing.is_cpo || false,
      fetched_at: listing.fetched_at || new Date().toISOString(),
      confidence_score: listing.confidence_score || 85
    }));

    console.log(`Successfully processed ${transformedListings.length} real marketplace listings`);
    return transformedListings;

  } catch (error) {
    console.error('Error in fetchMarketplaceListings:', error);
    toast.error('Failed to fetch marketplace data');
    return [];
  }
};