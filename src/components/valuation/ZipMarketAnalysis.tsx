
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { getMarketMultiplier, getMarketMultiplierDescription } from '@/utils/valuation/marketData';

interface ZipMarketAnalysisProps {
  zipCode: string;
  basePrice?: number;
  setZipCode?: (zipCode: string) => void;
  disabled?: boolean;
}

export function ZipMarketAnalysis({ zipCode, basePrice = 0, setZipCode, disabled }: ZipMarketAnalysisProps) {
  const [marketMultiplier, setMarketMultiplier] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!zipCode) {
        setError('No ZIP code provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const multiplier = await getMarketMultiplier(zipCode);
        setMarketMultiplier(multiplier);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Unable to fetch market data for this location');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [zipCode]);

  const getImpactDescription = (multiplier: number) => {
    if (multiplier > 4) return 'Very High Demand';
    if (multiplier > 2) return 'High Demand';
    if (multiplier > 0.5) return 'Moderate Demand';
    if (multiplier > -0.5) return 'Average Demand';
    if (multiplier > -2) return 'Low Demand';
    if (multiplier > -4) return 'Very Low Demand';
    return 'Extremely Low Demand';
  };

  const getImpactColor = (multiplier: number) => {
    if (multiplier > 2) return 'bg-green-100 text-green-800';
    if (multiplier > 0) return 'bg-green-50 text-green-600';
    if (multiplier > -2) return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-600';
  };

  const getPriceImpact = (multiplier: number, baseValue: number) => {
    const impact = baseValue * (multiplier / 100);
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(impact);
  };

  if (isLoading) {
    return (
      <Card className="bg-muted/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50/30 border border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Market Data Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (marketMultiplier === null) {
    return (
      <Card className="bg-muted/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No market data available for this ZIP code
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Local Market Analysis
          <Badge 
            className={getImpactColor(marketMultiplier)}
            variant="outline"
          >
            {marketMultiplier >= 0 ? '+' : ''}{marketMultiplier.toFixed(1)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={getImpactColor(marketMultiplier)} variant="secondary">
              {marketMultiplier >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {getImpactDescription(marketMultiplier)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {getMarketMultiplierDescription(marketMultiplier)}
          </p>
          {basePrice > 0 && (
            <p className="text-sm font-medium text-muted-foreground">
              Price impact: <span className={marketMultiplier >= 0 ? 'text-green-600' : 'text-red-600'}>
                {marketMultiplier >= 0 ? '+' : ''}{getPriceImpact(marketMultiplier, basePrice)}
              </span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
