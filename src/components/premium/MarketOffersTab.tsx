
import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { useMarketListings } from '@/hooks/useMarketListings';
import { Skeleton } from '@/components/ui/skeleton';

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

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(averages).map(([source, price]) => (
          <div 
            key={source} 
            className="bg-white border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{source}</h3>
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
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-700 mb-2">
          💡 These prices are real-time market estimates and may fluctuate.
        </p>
        <Link 
          to="/premium" 
          className="text-primary hover:underline"
        >
          Learn more about our pricing methodology
        </Link>
      </div>
    </div>
  );
};
