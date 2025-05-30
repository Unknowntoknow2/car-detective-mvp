
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  platform: string;
  location: string;
  url: string;
  mileage?: number;
  created_at: string;
}

interface MarketplaceComparisonCardProps {
  listings: MarketplaceListing[];
  dealerOffers: Array<{
    id: string;
    offer_amount: number;
    dealer_name?: string;
  }>;
  estimatedValue: number;
  ainRecommendation?: string;
}

export function MarketplaceComparisonCard({ 
  listings, 
  dealerOffers, 
  estimatedValue,
  ainRecommendation 
}: MarketplaceComparisonCardProps) {
  const averageMarketPrice = listings.length > 0 
    ? Math.round(listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length)
    : 0;

  const bestDealerOffer = dealerOffers.length > 0 
    ? Math.max(...dealerOffers.map(offer => offer.offer_amount))
    : 0;

  const priceComparison = bestDealerOffer - averageMarketPrice;
  const isAboveMarket = priceComparison > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Marketplace Comparison
        </CardTitle>
        {ainRecommendation && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-1">🤖 AIN Recommendation:</p>
            <p className="text-sm text-blue-700">{ainRecommendation}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Comparison Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Market Average</p>
            <p className="text-lg font-bold text-gray-900">
              {averageMarketPrice > 0 ? `$${averageMarketPrice.toLocaleString()}` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Best Dealer Offer</p>
            <p className="text-lg font-bold text-green-600">
              {bestDealerOffer > 0 ? `$${bestDealerOffer.toLocaleString()}` : 'No offers'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Price Delta</p>
            <div className="flex items-center justify-center gap-1">
              {isAboveMarket ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className={`text-lg font-bold ${isAboveMarket ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(priceComparison) > 0 ? `$${Math.abs(priceComparison).toLocaleString()}` : '$0'}
              </p>
            </div>
          </div>
        </div>

        {/* Marketplace Listings */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Recent Market Listings</h4>
          {listings.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {listings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {listing.platform}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {listing.title}
                    </p>
                    {listing.mileage && (
                      <p className="text-xs text-gray-500">
                        {listing.mileage.toLocaleString()} miles
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${listing.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(listing.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No marketplace listings found for comparison</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
