import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, ExternalLink, Star, Calendar, Gauge, Fuel, Settings } from 'lucide-react';

interface MarketListing {
  id: string;
  price: number;
  mileage?: number;
  location?: string;
  source: string;
  source_type?: string;
  listing_url?: string;
  dealer_name?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  condition?: string;
  is_cpo?: boolean;
  days_on_market?: number;
  dealer_rating?: number;
  exterior_color?: string;
  interior_color?: string;
  fuel_economy_city?: number;
  fuel_economy_highway?: number;
  drivetrain?: string;
  transmission_type?: string;
  engine_description?: string;
  photos?: string[];
  features?: string[];
  stock_number?: string;
}

interface GoogleStyleListingsProps {
  listings: MarketListing[];
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    zipCode?: string;
  };
  onListingClick?: (listing: MarketListing) => void;
}

export const GoogleStyleListings: React.FC<GoogleStyleListingsProps> = ({
  listings,
  vehicleInfo,
  onListingClick
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance' | 'days_on_market'>('price');
  const [showAll, setShowAll] = useState(false);
  
  const displayedListings = showAll ? listings : listings.slice(0, 6);
  
  const sortedListings = [...displayedListings].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'mileage':
        return (a.mileage || 0) - (b.mileage || 0);
      case 'days_on_market':
        return (a.days_on_market || 0) - (b.days_on_market || 0);
      default:
        return 0;
    }
  });

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType) {
      case 'dealer': return 'bg-blue-100 text-blue-800';
      case 'big_box_retailer': return 'bg-green-100 text-green-800';
      case 'online_retailer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'N/A';
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
  };

  if (listings.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Market Listings Found</h3>
          <p className="text-gray-600 text-sm">
            We couldn't find any active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} in your area.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Market Listings</h3>
          <p className="text-gray-600 text-sm">
            {listings.length} active listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="price">Price</option>
            <option value="mileage">Mileage</option>
            <option value="days_on_market">Newest</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedListings.map((listing) => (
          <Card 
            key={listing.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onListingClick?.(listing)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-primary">
                    {formatPrice(listing.price)}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {listing.year} {listing.make} {listing.model}
                    {listing.trim && ` ${listing.trim}`}
                  </p>
                </div>
                <Badge className={getSourceTypeColor(listing.source_type || 'dealer')}>
                  {listing.source}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatMileage(listing.mileage)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{listing.days_on_market || 0} days</span>
                </div>
              </div>

              {/* Vehicle Details */}
              {(listing.exterior_color || listing.fuel_economy_city) && (
                <div className="space-y-2">
                  {listing.exterior_color && (
                    <p className="text-xs text-gray-600">
                      Exterior: {listing.exterior_color}
                    </p>
                  )}
                  {listing.fuel_economy_city && (
                    <div className="flex items-center gap-2">
                      <Fuel className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {listing.fuel_economy_city}/{listing.fuel_economy_highway} mpg
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Dealer Info */}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{listing.dealer_name}</span>
                </div>
                {listing.dealer_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{listing.dealer_rating}</span>
                  </div>
                )}
              </div>

              {/* CPO Badge */}
              {listing.is_cpo && (
                <Badge variant="secondary" className="text-xs">
                  Certified Pre-Owned
                </Badge>
              )}

              {/* View Listing Button */}
              {listing.listing_url && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(listing.listing_url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Listing
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {listings.length > 6 && !showAll && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            Show All {listings.length} Listings
          </Button>
        </div>
      )}

      {/* Market Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Market Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600">Average Price</p>
              <p className="font-semibold">
                {formatPrice(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Price Range</p>
              <p className="font-semibold">
                {formatPrice(Math.min(...listings.map(l => l.price)))} - {formatPrice(Math.max(...listings.map(l => l.price)))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Avg. Days Listed</p>
              <p className="font-semibold">
                {Math.round(listings.reduce((sum, l) => sum + (l.days_on_market || 0), 0) / listings.length)} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};