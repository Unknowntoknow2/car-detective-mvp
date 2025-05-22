
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceComparisonChart } from './PriceComparisonChart';
import { ComparableListingsTable } from './ComparableListingsTable';
import { PremiumFeatureLock } from '@/components/premium/PremiumFeatureLock';
import { Flame, TrendingDown, Clock } from 'lucide-react';
import { aggregateValuationSources } from '@/utils/valuation/aggregateValuationSources';
import { formatCurrency } from '@/utils/formatters';

interface MarketInsightsTabProps {
  valuationId: string;
  isPremium?: boolean;
  vin?: string;
  zipCode?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  basePrice?: number;
  onUpgrade?: () => void;
}

export function MarketInsightsTab({
  valuationId,
  isPremium = false,
  vin = '',
  zipCode = '',
  make = '',
  model = '',
  year = 0,
  mileage = 0,
  condition = 'Good',
  basePrice = 0,
  onUpgrade
}: MarketInsightsTabProps) {
  const [marketData, setMarketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchMarketData() {
      if (!isPremium) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await aggregateValuationSources(
          vin,
          zipCode,
          mileage,
          condition,
          make,
          model,
          year,
          basePrice
        );
        
        setMarketData(data);
      } catch (err: any) {
        console.error('Error fetching market data:', err);
        setError(err.message || 'Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMarketData();
  }, [vin, make, model, year, isPremium, zipCode, mileage, condition, basePrice]);
  
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
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !marketData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-lg">
            <h3 className="font-medium text-destructive mb-2">Error Loading Market Data</h3>
            <p className="text-sm text-muted-foreground">
              {error || 'Unable to load market data. Please try again later.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { 
    averagePrices, 
    priceRange, 
    marketVelocity, 
    demandScore,
    topComps,
    regionName,
    zipAdjustment,
    mileageAdjustment,
    normalizedValue
  } = marketData;
  
  const getMarketIcon = () => {
    switch (marketVelocity) {
      case 'fast':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'slow':
        return <TrendingDown className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getMarketDescription = () => {
    switch (marketVelocity) {
      case 'fast':
        return `Hot market in ${regionName}`;
      case 'slow':
        return `Slow market in ${regionName}`;
      default:
        return `Moderate market in ${regionName}`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Market Analysis
          <Badge 
            variant={marketVelocity === 'fast' ? 'default' : 'outline'}
            className="flex items-center gap-1"
          >
            {getMarketIcon()}
            <span>{getMarketDescription()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Retail Average</div>
              <div className="text-2xl font-semibold">{formatCurrency(averagePrices.retail)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Private Party Average</div>
              <div className="text-2xl font-semibold">{formatCurrency(averagePrices.private)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Auction Average</div>
              <div className="text-2xl font-semibold">{formatCurrency(averagePrices.auction)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="price-analysis">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="price-analysis">Price Analysis</TabsTrigger>
            <TabsTrigger value="comparable-listings">Comparable Listings</TabsTrigger>
            <TabsTrigger value="adjustments">Price Adjustments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price-analysis" className="pt-4">
            <PriceComparisonChart
              vehicleData={{
                make,
                model,
                year,
                zipCode
              }}
              averagePrices={averagePrices}
              priceRange={priceRange}
              estimatedValue={basePrice}
              normalizedValue={normalizedValue}
            />
          </TabsContent>
          
          <TabsContent value="comparable-listings" className="pt-4">
            <ComparableListingsTable listings={topComps} />
          </TabsContent>
          
          <TabsContent value="adjustments" className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Price Adjustments</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Base Value</span>
                    <span className="font-medium">{formatCurrency(basePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Mileage Adjustment</span>
                    <span className={mileageAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {mileageAdjustment > 0 ? '+' : ''}{formatCurrency(mileageAdjustment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Location Adjustment ({regionName})</span>
                    <span className={zipAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {zipAdjustment > 0 ? '+' : ''}{formatCurrency(zipAdjustment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 font-medium">
                    <span>Adjusted Market Value</span>
                    <span className="text-lg">{formatCurrency(normalizedValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
