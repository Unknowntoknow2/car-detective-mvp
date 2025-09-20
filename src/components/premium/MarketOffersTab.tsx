
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters/formatCurrency';

interface MarketOffer {
  id: string;
  dealerName: string;
  price: number;
  location: string;
  mileage: number;
  condition: string;
  daysListed: number;
  source: string;
  photos?: string[];
  description?: string;
}

interface MarketStats {
  average: number;
  median: number;
  min: number;
  max: number;
  count: number;
}

interface MarketOffersTabProps {
  offers?: MarketOffer[];
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    zipCode?: string;
  };
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function MarketOffersTab({
  offers = [],
  vehicleData,
  isPremium = false,
  onUpgrade
}: MarketOffersTabProps) {
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'date'>('price');
  
  // Calculate market statistics
  const marketStats: MarketStats = React.useMemo(() => {
    if (offers.length === 0) {
      return { average: 0, median: 0, min: 0, max: 0, count: 0 };
    }

    const prices = offers.map((offer: MarketOffer) => offer.price).sort((a: number, b: number) => a - b);
    const sum = prices.reduce((sum: number, price: number) => sum + price, 0);
    const average = sum / prices.length;
    const median = prices.length % 2 === 0 
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];

    return {
      average,
      median,
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: offers.length
    };
  }, [offers]);

  const sortedOffers = React.useMemo(() => {
    return [...offers].sort((a: MarketOffer, b: MarketOffer) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'distance':
          // Simple alphabetical sort by location for now
          return a.location.localeCompare(b.location);
        case 'date':
          return a.daysListed - b.daysListed;
        default:
          return 0;
      }
    });
  }, [offers, sortBy]);

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-4">
            Access real-time market offers and pricing data with our premium plan.
          </p>
          <Button onClick={onUpgrade}>
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(marketStats.median)}</p>
              <p className="text-sm text-muted-foreground">Median Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(marketStats.average)}</p>
              <p className="text-sm text-muted-foreground">Average Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{marketStats.count}</p>
              <p className="text-sm text-muted-foreground">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {formatCurrency(marketStats.min)} - {formatCurrency(marketStats.max)}
              </p>
              <p className="text-sm text-muted-foreground">Price Range</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Offers</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Price
            </Button>
            <Button
              variant={sortBy === 'distance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('distance')}
            >
              Distance
            </Button>
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              Date Listed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedOffers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No offers available for this vehicle.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedOffers.map((offer: MarketOffer) => (
                <div key={offer.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{offer.dealerName}</h4>
                      <p className="text-sm text-muted-foreground">{offer.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatCurrency(offer.price)}</p>
                      <Badge variant="outline">{offer.condition}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{offer.mileage.toLocaleString()} miles</span>
                    <span>{offer.daysListed} days listed</span>
                    <span>via {offer.source}</span>
                  </div>
                  
                  {offer.description && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {offer.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
