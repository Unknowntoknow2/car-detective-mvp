import React from 'react';
import { MarketListing } from '@/types/marketListing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Car, MapPin, Star } from 'lucide-react';

interface SimilarListingsSectionProps {
  listings: MarketListing[];
}

export function SimilarListingsSection({ listings }: SimilarListingsSectionProps) {
  if (!listings?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Similar Market Listings</h2>
        <Badge variant="secondary" className="ml-auto">
          {listings.length} listings found
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.slice(0, 8).map((listing, index) => (
          <Card key={listing.id || index} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Image */}
              <div className="aspect-video w-full bg-muted rounded-lg mb-3 overflow-hidden">
                {listing.photos?.[0] ? (
                  <img 
                    src={listing.photos[0]} 
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm line-clamp-2">
                  {listing.year} {listing.make} {listing.model}
                  {listing.trim && ` ${listing.trim}`}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${listing.price?.toLocaleString() || 'N/A'}
                  </span>
                  {listing.is_cpo && (
                    <Badge variant="outline" className="text-xs">
                      CPO
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  {listing.mileage && (
                    <div className="flex items-center gap-1">
                      <span>{listing.mileage.toLocaleString()} miles</span>
                    </div>
                  )}
                  
                  {listing.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                  )}
                  
                  {(listing.dealer || listing.dealerName || listing.dealer_name) && (
                    <div className="flex items-center gap-1">
                      <span className="truncate">
                        {listing.dealer || listing.dealerName || listing.dealer_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Source and Link */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {listing.source || 'Market'}
                  </Badge>
                  
                  {(listing.listing_url || listing.listingUrl || listing.link) && (
                    <a 
                      href={listing.listing_url || listing.listingUrl || listing.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {listings.length > 8 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing 8 of {listings.length} similar listings
        </div>
      )}
    </div>
  );
}