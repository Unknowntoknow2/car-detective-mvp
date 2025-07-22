import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { MarketListing } from '@/types/marketListing';

interface MarketListingCardProps {
  listings: MarketListing[];
  targetVin?: string;
  exactVinMatch?: boolean;
}

export const MarketListingCard: React.FC<MarketListingCardProps> = ({
  listings,
  targetVin,
  exactVinMatch
}) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium text-gray-700 mb-2">Market Listings</h4>
        <p className="text-sm text-gray-500">No market listings found</p>
      </div>
    );
  }

  // Sort listings to show exact VIN match first
  const sortedListings = [...listings].sort((a, b) => {
    if (a.vin === targetVin && b.vin !== targetVin) return -1;
    if (b.vin === targetVin && a.vin !== targetVin) return 1;
    return b.price - a.price; // Then by price descending
  });

  const averagePrice = listings.reduce((sum, l) => sum + l.price, 0) / listings.length;
  const priceRange = {
    min: Math.min(...listings.map(l => l.price)),
    max: Math.max(...listings.map(l => l.price))
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Market Listings ({listings.length})</h4>
        {exactVinMatch && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            VIN Match Found
          </Badge>
        )}
      </div>
      
      {/* Price Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Average</p>
            <p className="font-medium">{formatCurrency(averagePrice)}</p>
          </div>
          <div>
            <p className="text-gray-500">Low</p>
            <p className="font-medium">{formatCurrency(priceRange.min)}</p>
          </div>
          <div>
            <p className="text-gray-500">High</p>
            <p className="font-medium">{formatCurrency(priceRange.max)}</p>
          </div>
        </div>
      </div>

      {/* Listing Cards */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {sortedListings.slice(0, 5).map((listing, index) => (
          <div 
            key={listing.id || index}
            className={`p-3 border rounded-md ${
              listing.vin === targetVin 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-lg">{formatCurrency(listing.price)}</span>
                  {listing.vin === targetVin && (
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      Exact VIN
                    </Badge>
                  )}
                  {(listing.is_cpo || listing.isCpo) && (
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                      Certified
                    </Badge>
                  )}
                </div>
                
                {(listing.dealer_name || listing.dealerName || listing.dealer) && (
                  <p className="text-sm font-medium text-gray-700">
                    {listing.dealer_name || listing.dealerName || listing.dealer}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  {listing.mileage && (
                    <span>{listing.mileage.toLocaleString()} mi</span>
                  )}
                  {listing.location && (
                    <span>{listing.location}</span>
                  )}
                  {(listing.confidence_score || listing.confidenceScore) && (
                    <span className="flex items-center gap-1">
                      {(listing.confidence_score || listing.confidenceScore || 0) >= 85 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                      )}
                      {listing.confidence_score || listing.confidenceScore}%
                    </span>
                  )}
                </div>
              </div>
              
              {(listing.listing_url || listing.listingUrl || listing.link || listing.url) && 
               (listing.listing_url || listing.listingUrl || listing.link || listing.url) !== '#' && (
                <a 
                  href={listing.listing_url || listing.listingUrl || listing.link || listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            
            {listing.vin && (
              <div className="mt-2 text-xs text-gray-500">
                VIN: {listing.vin}
              </div>
            )}
          </div>
        ))}
        
        {listings.length > 5 && (
          <p className="text-xs text-gray-500 text-center pt-2">
            +{listings.length - 5} more listings
          </p>
        )}
      </div>
    </div>
  );
};