
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { PriceComparisonChart } from './PriceComparisonChart';
import { ComparableListingsTable } from './ComparableListingsTable';
import { MarketTrendCard } from './MarketTrendCard';
import { LocalMarketCard } from './LocalMarketCard';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { aggregateValuationSources } from '@/utils/valuation/aggregateValuationSources';
import { formatCurrency } from '@/utils/formatters';

interface MarketInsightsTabProps {
  valuationId: string;
  isPremium?: boolean;
  zipCode?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  onUpgrade?: () => void;
}

export function MarketInsightsTab({
  valuationId,
  isPremium = false,
  zipCode = '90210',
  make = 'Unknown',
  model = 'Vehicle',
  year = new Date().getFullYear(),
  mileage = 50000,
  condition = 'Good',
  vin = '',
  onUpgrade
}: MarketInsightsTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<any>(null);
  
  // If not premium, show the lock component
  if (!isPremium) {
    return (
      <PremiumFeatureLock
        valuationId={valuationId}
        feature="market analysis"
        ctaText="Unlock Market Analysis"
        returnUrl={`/valuation/${valuationId}`}
      />
    );
  }
  
  useEffect(() => {
    async function fetchMarketData() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await aggregateValuationSources(
          vin,
          zipCode,
          mileage,
          condition,
          make,
          model,
          year,
          20000 // Base price - this would normally come from elsewhere
        );
        
        setMarketData(data);
      } catch (err: any) {
        console.error('Error fetching market data:', err);
        setError(err.message || 'Failed to load market data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMarketData();
  }, [vin, zipCode, mileage, condition, make, model, year]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // If no market data available yet, show a fallback
  if (!marketData) {
    // Mock data for development purposes
    const mockData = {
      averagePrices: {
        retail: 24500,
        auction: 21000,
        private: 23000,
        overall: 23500
      },
      priceRange: {
        min: 20000,
        max: 27000
      },
      estimatedValue: 23500,
      normalizedValue: 24000,
      marketVelocity: 'moderate',
      demandScore: 7,
      topComps: [
        {
          title: `${year} ${make} ${model}`,
          price: 24500,
          source: 'AutoTrader',
          mileage: 35000,
          url: 'https://www.autotrader.com'
        },
        {
          title: `${year} ${make} ${model}`,
          price: 23800,
          source: 'Cars.com',
          mileage: 42000,
          url: 'https://www.cars.com'
        },
        {
          title: `${year} ${make} ${model}`,
          price: 22500,
          source: 'Craigslist',
          mileage: 47000,
          url: 'https://www.craigslist.org'
        }
      ]
    };
    
    setMarketData(mockData);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Using Preview Data</AlertTitle>
            <AlertDescription>
              No market data available yet. Showing preview data for demonstration purposes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="trends">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="listings">Comparable Listings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketTrendCard 
                trend={marketData.marketVelocity === 'fast' ? 'increasing' : 
                       marketData.marketVelocity === 'slow' ? 'decreasing' : 'stable'}
                trendPercentage={marketData.marketVelocity === 'fast' ? 2.5 : 
                                marketData.marketVelocity === 'slow' ? -1.8 : 0.3}
                listingCount={marketData.topComps.length}
                averageDaysOnMarket={45} // This would come from market data
              />
              
              <LocalMarketCard
                similarVehiclesNearby={marketData.topComps.length}
                demandScore={marketData.demandScore}
              />
            </div>
            
            <PriceComparisonChart
              vehicleData={{
                make,
                model,
                year,
                zipCode
              }}
              averagePrices={marketData.averagePrices}
              priceRange={marketData.priceRange}
              estimatedValue={marketData.estimatedValue}
              normalizedValue={marketData.normalizedValue}
            />
          </TabsContent>
          
          <TabsContent value="listings" className="pt-4">
            <ComparableListingsTable listings={marketData.topComps} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
