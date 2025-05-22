
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import auction data fetchers
import { fetchManheimAuctionHistory, formatManheimResults } from '@/utils/auctions/manheim';
import { fetchIAAIAuctionHistory, formatIAAIResults } from '@/utils/auctions/iaai';
import { fetchCopartAuctionHistory, formatCopartResults } from '@/utils/auctions/copart';

interface AuctionResult {
  vin: string;
  source: string;
  price: string;
  sold_date: string;
  odometer: string;
  condition_grade?: string;
  location?: string;
  photo_urls?: string[];
}

interface MarketInsight {
  listings: any[];
  auctions: AuctionResult[];
  averagePrices: {
    retail: number;
    auction: number;
    private: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  isLoading: boolean;
  error: string | null;
}

export function useMarketInsights(vin: string, make: string, model: string, year: number) {
  const [insights, setInsights] = useState<MarketInsight>({
    listings: [],
    auctions: [],
    averagePrices: { retail: 0, auction: 0, private: 0 },
    priceRange: { min: 0, max: 0 },
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!vin && (!make || !model || !year)) {
      setInsights(prev => ({ ...prev, isLoading: false, error: 'Insufficient vehicle data provided' }));
      return;
    }

    async function fetchInsights() {
      try {
        // 1. Fetch auction history from DB first
        const { data: existingAuctions, error: auctionError } = await supabase
          .from('auction_results_by_vin')
          .select('*')
          .eq('vin', vin);

        if (auctionError) throw new Error(`Error fetching auction data: ${auctionError.message}`);
        
        let auctionResults: AuctionResult[] = existingAuctions || [];
        
        // 2. If no results in DB, fetch from auction services
        if (!existingAuctions || existingAuctions.length === 0) {
          const [manheimResults, iaaiResults, copartResults] = await Promise.all([
            fetchManheimAuctionHistory(vin),
            fetchIAAIAuctionHistory(vin),
            fetchCopartAuctionHistory(vin)
          ]);
          
          // Format results
          const formattedManheim = formatManheimResults(manheimResults);
          const formattedIAAI = formatIAAIResults(iaaiResults);
          const formattedCopart = formatCopartResults(copartResults);
          
          // Combine all results
          auctionResults = [...formattedManheim, ...formattedIAAI, ...formattedCopart];
          
          // Store in database if we got results
          if (auctionResults.length > 0) {
            await supabase.from('auction_results_by_vin').insert(auctionResults);
          }
        }
        
        // 3. Fetch market listings (from Supabase or edge function)
        const { data: marketListings } = await supabase.functions.invoke('fetch-market-listings', {
          body: { 
            vin, 
            make, 
            model, 
            year,
            zipCode: '00000' // This would normally come from user profile
          }
        });
        
        // 4. Calculate average prices and ranges
        const retailPrices = marketListings?.filter(l => 
          l.source === 'cargurus' || l.source === 'autotrader' || l.source === 'cars.com'
        ).map(l => l.price) || [];
        
        const privatePrices = marketListings?.filter(l => 
          l.source === 'craigslist' || l.source === 'facebook'
        ).map(l => l.price) || [];
        
        const auctionPrices = auctionResults.map(a => parseFloat(a.price)).filter(p => !isNaN(p));
        
        // Calculate averages
        const getAverage = (arr: number[]) => 
          arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
        
        const averagePrices = {
          retail: Math.round(getAverage(retailPrices)),
          private: Math.round(getAverage(privatePrices)),
          auction: Math.round(getAverage(auctionPrices))
        };
        
        // Calculate overall price range
        const allPrices = [...retailPrices, ...privatePrices, ...auctionPrices].filter(p => p > 0);
        const priceRange = {
          min: allPrices.length ? Math.min(...allPrices) : 0,
          max: allPrices.length ? Math.max(...allPrices) : 0
        };
        
        // 5. Update state with all data
        setInsights({
          listings: marketListings || [],
          auctions: auctionResults,
          averagePrices,
          priceRange,
          isLoading: false,
          error: null
        });
        
      } catch (error: any) {
        console.error('Error fetching market insights:', error);
        setInsights(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to load market insights'
        }));
        toast.error('Error loading market data');
      }
    }
    
    fetchInsights();
  }, [vin, make, model, year]);
  
  return insights;
}
