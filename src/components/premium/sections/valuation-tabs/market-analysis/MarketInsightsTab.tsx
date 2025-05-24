
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketTrendCard } from './MarketTrendCard';
import { LocalMarketCard } from './LocalMarketCard';
import { PriceComparisonChart } from './PriceComparisonChart';
import { ComparableListingsTable } from './ComparableListingsTable';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { useMarketInsights } from '@/hooks/useMarketInsights';
import { Loader2, AlertTriangle } from 'lucide-react';

interface MarketInsightsTabProps {
  valuationId?: string;
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

interface Listing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  condition: string;
  location: string;
  daysListed: number;
  source: string;
}

export function MarketInsightsTab({
  valuationId = '',
  isPremium = false,
  zipCode = '90210',
  make = 'Unknown',
  model = 'Vehicle',
  year = new Date().getFullYear(),
  mileage = 0,
  condition = 'Good',
  vin = '',
  onUpgrade
}: MarketInsightsTabProps) {
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
  
  const { data, isLoading, error } = useMarketInsights({ 
    make, 
    model, 
    year, 
    zipCode 
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 min-h-[300px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>Loading market data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading market data</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No market data available for this vehicle.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Extract data from the query result
  const comparableVehicles = data.comparableVehicles || [];
  
  // Map the trend direction values from useMarketInsights to what MarketTrendCard expects
  const mapTrendDirection = (direction: 'up' | 'down' | 'stable'): 'increasing' | 'decreasing' | 'stable' => {
    if (direction === 'up') return 'increasing';
    if (direction === 'down') return 'decreasing';
    return 'stable';
  };
  
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
                trend={mapTrendDirection(data.trendDirection)}
                trendPercentage={data.trendPercentage}
                listingCount={data.similarListings}
                averageDaysOnMarket={45} // Sample value
              />
              
              <LocalMarketCard
                similarVehiclesNearby={data.similarListings}
                demandScore={data.demandScore}
              />
            </div>
            
            <PriceComparisonChart
              vehicleData={{
                make,
                model,
                year,
                zipCode: zipCode || '90210'
              }}
              averagePrices={data.averagePrices}
              priceRange={{
                min: data.averagePrices.auction,
                max: data.averagePrices.retail
              }}
              estimatedValue={data.averagePrices.overall}
              normalizedValue={data.averagePrices.overall * (data.regionMultiplier || 1)}
            />
          </TabsContent>
          
          <TabsContent value="listings" className="pt-4">
            {comparableVehicles.length > 0 ? (
              <ComparableListingsTable listings={comparableVehicles.map((listing: Listing, index: number) => ({
                id: listing.id || `listing-${index}`,
                title: listing.title,
                price: listing.price,
                mileage: listing.mileage,
                condition: listing.condition,
                location: listing.location,
                daysListed: listing.daysListed,
                source: listing.source
              }))} />
            ) : (
              <p className="text-muted-foreground text-center py-8">No comparable listings found.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
