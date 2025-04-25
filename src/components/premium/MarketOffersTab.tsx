
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ExternalLink, AlertTriangle, Loader2, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useMarketListings } from '@/hooks/useMarketListings';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarketOffersProps {
  zipCode?: string;
  make?: string;
  model?: string;
  year?: number;
  averages?: { [source: string]: number };
  sources?: { [source: string]: string };
}

export const MarketOffersTab: React.FC<MarketOffersProps> = ({ 
  zipCode, 
  make, 
  model, 
  year,
  averages: propAverages,
  sources: propSources
}) => {
  const { marketData, isLoading, error } = useMarketListings(
    zipCode || '',
    make || '',
    model || '',
    year || 0
  );
  
  const averages = propAverages || marketData?.averages;
  const sources = propSources || marketData?.sources;
  
  // Calculate market statistics if we have data
  const marketStats = React.useMemo(() => {
    if (!averages) return null;
    
    const prices = Object.values(averages);
    if (prices.length === 0) return null;
    
    // Calculate basic statistics
    const sorted = [...prices].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const sum = prices.reduce((a, b) => a + b, 0);
    const mean = Math.round(sum / prices.length);
    
    // Calculate median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 
      ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) 
      : sorted[mid];
    
    // Calculate standard deviation
    const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
    const stdDev = Math.round(Math.sqrt(avgSquaredDiff));
    
    return { min, max, mean, median, stdDev, count: prices.length, priceRange: max - min };
  }, [averages]);
  
  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }
  
  if (error || !averages || !sources) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Could not load market offers</h3>
        <p className="text-muted-foreground mt-2">
          {error || "Market data is not available for this vehicle."}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Try providing more details about your vehicle or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Market Offers</h2>
        <div className="flex items-center text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Live Market Data</span>
        </div>
      </div>
      
      {marketStats && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6">
          <h3 className="text-lg font-semibold mb-3">Market Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded p-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Average Price</p>
              <p className="text-lg font-bold">${marketStats.mean.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded p-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Median Price</p>
              <p className="text-lg font-bold">${marketStats.median.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded p-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Price Range</p>
              <p className="text-lg font-bold">${marketStats.priceRange.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded p-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Std Deviation</p>
              <p className="text-lg font-bold">${marketStats.stdDev.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(averages)
          .sort((a, b) => b[1] - a[1]) // Sort by price (descending)
          .map(([source, price]) => {
            // Calculate how this listing compares to the average
            const priceDiff = marketStats ? Math.round(((price / marketStats.mean) - 1) * 100) : 0;
            const isHigher = priceDiff > 0;
            
            return (
              <div 
                key={source} 
                className="bg-white border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{source}</h3>
                    {Math.abs(priceDiff) >= 2 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge 
                              variant={isHigher ? "destructive" : "default"}
                              className={`flex items-center gap-1 ${isHigher ? 'bg-red-100 text-red-800 hover:bg-red-100' : 'bg-green-100 text-green-800 hover:bg-green-100'}`}
                            >
                              {isHigher ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {isHigher ? '+' : ''}{priceDiff}%
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isHigher ? 'Above' : 'Below'} average market price</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-xl font-bold text-primary mt-2">
                    ${price.toLocaleString()}
                  </p>
                </div>
                <a 
                  href={sources[source]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  View <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            );
          })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-2 items-start">
          <Info className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-700 mb-2">
              These prices are real-time market estimates from {Object.keys(averages).length} different sources.
              Prices may fluctuate based on specific vehicle condition, options, and local market demand.
            </p>
            <Link 
              to="/premium" 
              className="text-primary hover:underline"
            >
              Learn more about our pricing methodology
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
