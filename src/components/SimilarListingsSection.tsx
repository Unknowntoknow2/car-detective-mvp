import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin } from 'lucide-react';
import type { MarketListing } from '@/types/marketListing';

interface SimilarListingsSectionProps {
  listings: MarketListing[];
}

export function SimilarListingsSection({ listings }: SimilarListingsSectionProps) {
  if (!listings?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No similar listings found nearby.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Listings in Your Area ({listings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.slice(0, 8).map((listing, index) => (
            <div
              key={listing.id || index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
            >
              {/* Image placeholder or actual image */}
              <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                {listing.photos && listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[0]}
                    alt={`${listing.year} ${listing.make} ${listing.model}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">No Image</div>
                )}
              </div>

              {/* Vehicle info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  {listing.year} {listing.make} {listing.model}
                  {listing.trim && ` ${listing.trim}`}
                </h3>

                {/* Price */}
                <div className="text-lg font-bold text-primary">
                  ${listing.price.toLocaleString()}
                </div>

                {/* Mileage and condition */}
                <div className="text-sm text-muted-foreground">
                  {listing.mileage?.toLocaleString() || 'Unknown'} miles
                  {listing.condition && ` • ${listing.condition}`}
                </div>

                {/* Location */}
                {listing.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {listing.location}
                  </div>
                )}

                {/* Dealer */}
                {listing.dealer_name && (
                  <div className="text-sm text-muted-foreground">
                    {listing.dealer_name}
                  </div>
                )}

                {/* Source and badges */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {listing.source}
                  </div>
                  <div className="flex gap-1">
                    {listing.is_cpo && (
                      <Badge variant="secondary" className="text-xs">
                        CPO
                      </Badge>
                    )}
                    {listing.vin && (
                      <Badge variant="outline" className="text-xs">
                        VIN Match
                      </Badge>
                    )}
                  </div>
                </div>

                {/* View listing link */}
                {listing.listing_url && listing.listing_url !== '#' && (
                  <a
                    href={listing.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View Listing
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}