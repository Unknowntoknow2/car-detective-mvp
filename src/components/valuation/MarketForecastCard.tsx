
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VinForecast, getOrCreateVinForecast, formatForecastText } from '@/services/vinForecastService';

interface MarketForecastCardProps {
  vin: string;
  estimatedValue: number;
}

export function MarketForecastCard({ vin, estimatedValue }: MarketForecastCardProps) {
  const [forecast, setForecast] = useState<VinForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForecast = async () => {
      if (!vin) return;
      
      setLoading(true);
      try {
        const forecastData = await getOrCreateVinForecast(vin);
        setForecast(forecastData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [vin]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Forecast unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (forecast.forecast_trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (forecast.forecast_trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = () => {
    const confidence = forecast.confidence;
    if (confidence > 0.7) return 'default';
    if (confidence > 0.5) return 'secondary';
    return 'outline';
  };

  const dataTooltip = forecast.market_factors ? 
    `Based on ${forecast.market_factors.auctionCount} auction records and ${forecast.market_factors.marketplaceListingCount} marketplace listings` :
    'Based on available market data';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            📈 Market Forecast
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{dataTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Badge variant={getBadgeVariant()}>
            {Math.round(forecast.confidence * 100)}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`flex items-center gap-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">
              {formatForecastText(forecast)}
            </span>
          </div>
          
          {forecast.reasoning && (
            <p className="text-sm text-gray-600">
              {forecast.reasoning}
            </p>
          )}
          
          <div className="text-xs text-gray-500 pt-2 border-t">
            Forecast generated on {new Date(forecast.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
