
import { useQuery } from '@tanstack/react-query';

interface MarketInsightsParams {
  make: string;
  model: string;
  year: number;
  zipCode?: string;
}

interface MarketInsightsData {
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  similarListings: number;
  demandScore: number;
  averagePrices: {
    retail: number;
    auction: number;
    private: number;
    overall: number;
  };
  regionMultiplier: number;
  comparableVehicles: Array<{
    id: string;
    title: string;
    price: number;
    mileage: number;
    condition: string;
    location: string;
    daysListed: number;
    source: string;
  }>;
}

export function useMarketInsights(params: MarketInsightsParams) {
  return useQuery({
    queryKey: ['marketInsights', params.make, params.model, params.year, params.zipCode],
    queryFn: async (): Promise<MarketInsightsData> => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        trendDirection: 'up',
        trendPercentage: 2.5,
        similarListings: 24,
        demandScore: 7,
        averagePrices: {
          retail: 25500,
          auction: 21200,
          private: 23800,
          overall: 24000
        },
        regionMultiplier: 1.05,
        comparableVehicles: [
          {
            id: 'comp1',
            title: `${params.year} ${params.make} ${params.model}`,
            price: 24500,
            mileage: 35000,
            condition: 'Good',
            location: 'Beverly Hills, CA',
            daysListed: 14,
            source: 'Autotrader'
          },
          {
            id: 'comp2',
            title: `${params.year} ${params.make} ${params.model}`,
            price: 25900,
            mileage: 28000,
            condition: 'Excellent',
            location: 'Santa Monica, CA',
            daysListed: 7,
            source: 'Cars.com'
          }
        ]
      };
    },
    enabled: Boolean(params.make && params.model && params.year),
  });
}
