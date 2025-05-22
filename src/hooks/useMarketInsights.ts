
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface MarketListing {
  id: string;
  title: string;
  price: number;
  url: string;
  source: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  image?: string;
  location?: string;
}

interface MarketInsight {
  listings: MarketListing[];
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
        let auctionResults: AuctionResult[] = [];
        
        try {
          const { data: existingAuctions, error: auctionError } = await supabase
            .from('auction_results_by_vin')
            .select('*')
            .eq('vin', vin);

          if (!auctionError && existingAuctions) {
            auctionResults = existingAuctions;
          }
        } catch (error) {
          console.error('Error fetching auction data:', error);
          // Continue with empty auction results
        }
        
        // 2. Only attempt to fetch external data if no DB results
        if (auctionResults.length === 0) {
          try {
            // Generate mock auction data instead of making actual API calls
            auctionResults = generateMockAuctionData(vin, make, model, year);
          } catch (error) {
            console.error('Error generating mock auction data:', error);
            // Continue with empty auction results
          }
        }
        
        // 3. Fetch market listings (mock data for now)
        let marketListings: MarketListing[] = [];
        
        try {
          // Try to fetch from Supabase function
          const { data: fetchedListings, error } = await supabase.functions.invoke('fetch-market-listings', {
            body: { 
              vin, 
              make, 
              model, 
              year,
              zipCode: '00000' // This would normally come from user profile
            }
          });
          
          if (!error && fetchedListings) {
            marketListings = fetchedListings;
          } else {
            // Fallback to mock data
            marketListings = generateMockMarketListings(make, model, year);
          }
        } catch (error) {
          console.error('Error fetching market listings:', error);
          // Fallback to mock data
          marketListings = generateMockMarketListings(make, model, year);
        }
        
        // 4. Calculate average prices and ranges
        const retailPrices = marketListings
          .filter(l => ['cargurus', 'autotrader', 'cars.com'].includes(l.source))
          .map(l => l.price)
          .filter(price => price > 0);
        
        const privatePrices = marketListings
          .filter(l => ['craigslist', 'facebook'].includes(l.source))
          .map(l => l.price)
          .filter(price => price > 0);
        
        const auctionPrices = auctionResults
          .map(a => parseFloat(a.price))
          .filter(p => !isNaN(p) && p > 0);
        
        // Calculate averages
        const getAverage = (arr: number[]): number => 
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
          listings: marketListings,
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

// Helper function to generate mock auction data
function generateMockAuctionData(vin: string, make: string, model: string, year: number): AuctionResult[] {
  const basePrice = 15000 + (year - 2010) * 1000;
  
  return [
    {
      vin: vin || `${make.substring(0, 3)}${model.substring(0, 3)}${year}`,
      source: 'manheim',
      price: String(Math.round(basePrice * 0.85)),
      sold_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      odometer: String(Math.round(12000 * (new Date().getFullYear() - year)))
    },
    {
      vin: vin || `${make.substring(0, 3)}${model.substring(0, 3)}${year}`,
      source: 'iaai',
      price: String(Math.round(basePrice * 0.82)),
      sold_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      odometer: String(Math.round(13000 * (new Date().getFullYear() - year)))
    },
    {
      vin: vin || `${make.substring(0, 3)}${model.substring(0, 3)}${year}`,
      source: 'copart',
      price: String(Math.round(basePrice * 0.8)),
      sold_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      odometer: String(Math.round(14000 * (new Date().getFullYear() - year)))
    }
  ];
}

// Helper function to generate mock market listings
function generateMockMarketListings(make: string, model: string, year: number): MarketListing[] {
  const basePrice = 15000 + (year - 2010) * 1000;
  const locations = ['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
  
  return [
    {
      id: '1',
      title: `${year} ${make} ${model}`,
      price: Math.round(basePrice * 1.1),
      url: '#',
      source: 'cargurus',
      make,
      model,
      year,
      mileage: Math.round(12000 * (new Date().getFullYear() - year)),
      location: locations[0]
    },
    {
      id: '2',
      title: `${year} ${make} ${model}`,
      price: Math.round(basePrice * 1.05),
      url: '#',
      source: 'autotrader',
      make,
      model,
      year,
      mileage: Math.round(15000 * (new Date().getFullYear() - year)),
      location: locations[1]
    },
    {
      id: '3',
      title: `${year} ${make} ${model}`,
      price: Math.round(basePrice * 0.95),
      url: '#',
      source: 'craigslist',
      make,
      model,
      year,
      mileage: Math.round(18000 * (new Date().getFullYear() - year)),
      location: locations[2]
    },
    {
      id: '4',
      title: `${year} ${make} ${model}`,
      price: Math.round(basePrice * 0.98),
      url: '#',
      source: 'facebook',
      make,
      model,
      year,
      mileage: Math.round(14000 * (new Date().getFullYear() - year)),
      location: locations[3]
    }
  ];
}
