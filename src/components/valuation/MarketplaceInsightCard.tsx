
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useScrapedListings } from '@/hooks/useScrapedListings'
import { ExternalLink, MapPin, Clock } from 'lucide-react'

interface MarketplaceInsightCardProps {
  vin: string;
  estimatedValue?: number;
}

export const MarketplaceInsightCard: React.FC<MarketplaceInsightCardProps> = ({ 
  vin, 
  estimatedValue 
}) => {
  const { data: listings, isLoading, error } = useScrapedListings(vin);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marketplace Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading public listings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !listings || listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Marketplace Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4">
            No recent marketplace listings found for this vehicle.
          </p>
        </CardContent>
      </Card>
    );
  }

  const validListings = listings.filter(listing => listing.price && listing.price > 0);
  const averagePrice = validListings.length > 0 
    ? Math.round(validListings.reduce((sum, listing) => sum + (listing.price || 0), 0) / validListings.length)
    : null;

  let comparison = null;
  if (estimatedValue && averagePrice) {
    const difference = estimatedValue - averagePrice;
    const percentDiff = Math.abs((difference / averagePrice) * 100);
    
    comparison = {
      difference,
      percentDiff,
      isHigher: difference > 0
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Marketplace Listings
          {averagePrice && (
            <span className="text-sm font-normal text-muted-foreground">
              Avg: ${averagePrice.toLocaleString()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {validListings.length > 0 ? (
          <>
            <ul className="space-y-2">
              {validListings.slice(0, 5).map((listing) => (
                <li key={listing.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <a 
                        href={listing.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline line-clamp-2 flex items-center gap-1"
                      >
                        {listing.title}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                          {listing.platform}
                        </span>
                        {listing.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {listing.location}
                          </span>
                        )}
                        {listing.mileage && (
                          <span>{listing.mileage.toLocaleString()} mi</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-green-600">
                        ${listing.price?.toLocaleString()}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {comparison && (
              <div className="pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  {comparison.difference === 0 
                    ? 'At marketplace average' 
                    : `${comparison.percentDiff.toFixed(1)}% ${
                        comparison.isHigher ? 'above' : 'below'
                      } marketplace average`
                  }
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            No valid pricing data found in marketplace listings.
          </p>
        )}
        
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Data from Craigslist, Facebook Marketplace, OfferUp and other platforms
        </p>
      </CardContent>
    </Card>
  );
}

export default MarketplaceInsightCard;
