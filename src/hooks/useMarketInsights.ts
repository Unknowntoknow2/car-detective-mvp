
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';

interface MarketInsightsProps {
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
}

export interface MarketInsightsData {
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendPercentage: number;
  averagePrices: {
    retail: number;
    private: number;
    auction: number;
    overall: number;
  };
  regionMultiplier: number;
  demandScore: number;
  similarListings: number;
  comparableVehicles: Array<{
    id: string;
    title: string;
    price: number;
    mileage: number;
    condition: string;
    location: string;
    source: string;
    daysListed: number;
  }>;
}

export function useMarketInsights({ make, model, year, zipCode }: MarketInsightsProps) {
  const queryKey = ['market-insights', make, model, year, zipCode];
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<MarketInsightsData> => {
      try {
        // Default values if API call fails
        const defaultData: MarketInsightsData = {
          trendDirection: 'stable',
          trendPercentage: 0,
          averagePrices: {
            retail: 25000,
            private: 23000,
            auction: 21000,
            overall: 23000
          },
          regionMultiplier: 1.0,
          demandScore: 5,
          similarListings: 12,
          comparableVehicles: []
        };
        
        // Try to fetch auction data from supabase
        try {
          const { data: auctionData, error } = await supabase
            .from('auction_data')
            .select('*')
            .eq('make', make)
            .eq('model', model)
            .gte('year', Number(year) - 2)
            .lte('year', Number(year) + 2)
            .limit(50);
            
          if (error) {
            console.error('Error fetching auction data:', error);
            // Fall back to default data but continue execution
          } else if (auctionData && auctionData.length > 0) {
            // Process auction data to enhance default values
            const prices = auctionData.map(item => item.sale_price).filter(Boolean);
            if (prices.length > 0) {
              const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
              
              // Update default data with real auction data
              defaultData.averagePrices.auction = Math.round(avgPrice);
              defaultData.averagePrices.overall = Math.round(
                (defaultData.averagePrices.retail + defaultData.averagePrices.private + avgPrice) / 3
              );
              
              // Calculate trend based on dates
              const sortedByDate = [...auctionData].sort((a, b) => 
                new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
              );
              
              if (sortedByDate.length > 5) {
                const oldPrices = sortedByDate.slice(0, Math.floor(sortedByDate.length / 2))
                  .map(item => item.sale_price)
                  .filter(Boolean);
                  
                const newPrices = sortedByDate.slice(Math.floor(sortedByDate.length / 2))
                  .map(item => item.sale_price)
                  .filter(Boolean);
                  
                if (oldPrices.length > 0 && newPrices.length > 0) {
                  const oldAvg = oldPrices.reduce((sum, price) => sum + price, 0) / oldPrices.length;
                  const newAvg = newPrices.reduce((sum, price) => sum + price, 0) / newPrices.length;
                  
                  const percentChange = ((newAvg - oldAvg) / oldAvg) * 100;
                  
                  defaultData.trendPercentage = parseFloat(percentChange.toFixed(1));
                  defaultData.trendDirection = 
                    percentChange > 1 ? 'increasing' : 
                    percentChange < -1 ? 'decreasing' : 'stable';
                }
              }
              
              // Create comparable vehicles from auction data
              defaultData.comparableVehicles = auctionData.slice(0, 5).map(item => ({
                id: item.id || `auction-${Math.random().toString(36).substring(2, 9)}`,
                title: `${item.year} ${item.make} ${item.model}`,
                price: item.sale_price,
                mileage: item.mileage || 0,
                condition: item.condition || 'Good',
                location: item.location || 'Unknown',
                source: item.auction_name || 'Auction',
                daysListed: 0
              }));
              
              defaultData.similarListings = auctionData.length;
            }
          }
        } catch (auctionError) {
          console.error('Failed to process auction data:', auctionError);
          // Continue with default data
        }
        
        // Try to fetch region multiplier if we have a ZIP code
        if (zipCode) {
          try {
            // This would typically be an API call to get regional pricing data
            // For now, we'll use a simple calculation based on the first digit
            const firstDigit = zipCode.substring(0, 1);
            const regionMapping: Record<string, number> = {
              '0': 1.02, // Northeast
              '1': 1.03, // Northeast
              '2': 0.97, // South
              '3': 0.98, // South
              '4': 1.00, // Midwest
              '5': 0.99, // Midwest
              '6': 0.97, // South Central
              '7': 0.98, // Central
              '8': 1.01, // Mountain
              '9': 1.05, // West Coast
            };
            
            defaultData.regionMultiplier = regionMapping[firstDigit] || 1.0;
            
            // Adjust prices based on region
            const adjustment = defaultData.regionMultiplier;
            defaultData.averagePrices.retail *= adjustment;
            defaultData.averagePrices.private *= adjustment;
            defaultData.averagePrices.auction *= adjustment;
            defaultData.averagePrices.overall *= adjustment;
          } catch (zipError) {
            console.error('Error calculating region multiplier:', zipError);
            // Continue with unadjusted data
          }
        }
        
        return defaultData;
      } catch (error) {
        console.error('Error in market insights query:', error);
        // Return fallback data in case of any errors
        return {
          trendDirection: 'stable',
          trendPercentage: 0,
          averagePrices: {
            retail: 25000,
            private: 23000,
            auction: 21000,
            overall: 23000
          },
          regionMultiplier: 1.0,
          demandScore: 5,
          similarListings: 12,
          comparableVehicles: []
        };
      }
    },
    enabled: !!(make && model && year),
  });
}
