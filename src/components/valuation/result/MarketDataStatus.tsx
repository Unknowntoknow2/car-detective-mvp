
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface MarketListing {
  id: string;
  price: number;
  mileage?: number;
  location?: string;
  source: string;
  listing_url?: string;
  dealer_name?: string;
  year?: number;
  make?: string;
  model?: string;
}

interface MarketDataStatusProps {
  marketListings: MarketListing[];
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    zipCode?: string;
  };
  searchRadius?: number;
}

export const MarketDataStatus: React.FC<MarketDataStatusProps> = ({
  marketListings,
  vehicleInfo,
  searchRadius = 100
}) => {
  const hasListings = marketListings.length > 0;
  const avgPrice = hasListings ? marketListings.reduce((sum, l) => sum + l.price, 0) / marketListings.length : 0;
  const priceRange = hasListings ? {
    min: Math.min(...marketListings.map(l => l.price)),
    max: Math.max(...marketListings.map(l => l.price))
  } : null;

  if (!hasListings) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            Market Data Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                0 Listings Found
              </Badge>
              <span className="text-sm text-amber-700">
                No current market listings for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </span>
            </div>
            
            <div className="p-3 bg-white border border-amber-200 rounded">
              <h4 className="font-medium text-sm text-amber-800 mb-2">Search Parameters</h4>
              <div className="space-y-1 text-xs text-amber-700">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Within {searchRadius} miles of {vehicleInfo.zipCode || 'your location'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Last 30 days of listings</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-amber-600">
              <strong>Impact:</strong> Valuation uses MSRP-adjusted model with industry-standard depreciation curves. 
              Confidence score reduced accordingly.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          Market Listings ({marketListings.length})
          <Badge variant="default" className="text-xs">Live Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Price Summary */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
            <div className="text-center">
              <p className="text-xs text-gray-500">Average</p>
              <p className="font-medium">{formatCurrency(avgPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Range Low</p>
              <p className="font-medium">{priceRange ? formatCurrency(priceRange.min) : '-'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Range High</p>
              <p className="font-medium">{priceRange ? formatCurrency(priceRange.max) : '-'}</p>
            </div>
          </div>

          {/* Listing Preview */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {marketListings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">{formatCurrency(listing.price)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {listing.mileage && <span>{listing.mileage.toLocaleString()} mi</span>}
                    {listing.dealer_name && <span>{listing.dealer_name}</span>}
                    {listing.location && <span>{listing.location}</span>}
                  </div>
                </div>
                {listing.listing_url && (
                  <a 
                    href={listing.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
            
            {marketListings.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                +{marketListings.length - 3} more listings included in analysis
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
