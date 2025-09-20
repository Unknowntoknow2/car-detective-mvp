import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLink, 
  MapPin, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MarketListing } from '@/types/marketListing';

interface MarketListingsGridProps {
  listings: MarketListing[];
  listingCount?: number;
  marketSearchStatus?: 'success' | 'partial' | 'error' | 'no_results';
}

export function MarketListingsGrid({
  listings,
  listingCount = 0,
  marketSearchStatus = 'no_results'
}: MarketListingsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllListings, setShowAllListings] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'mileage' | 'distance'>('price');

  const displayedListings = showAllListings ? listings : listings.slice(0, 6);

  const sortedListings = [...displayedListings].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'mileage':
        return (a.mileage || 0) - (b.mileage || 0);
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      default:
        return 0;
    }
  });

  const getStatusDisplay = () => {
    switch (marketSearchStatus) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'Live Market Data Found',
          description: `Found ${listingCount} comparable vehicles in your area`
        };
      case 'partial':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          title: 'Limited Market Data',
          description: 'Some market data available, supplemented with estimates'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'Market Search Error',
          description: 'Unable to fetch current market data'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          title: 'No Market Data',
          description: 'No comparable listings found in your area'
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Alert className={`${status.bg} ${status.border}`}>
          <StatusIcon className={`h-4 w-4 ${status.color}`} />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">{status.title}</p>
              <p className="text-sm">{status.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Valuation based on depreciation model and regional market adjustments.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className={`${status.bg} ${status.border}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${status.color}`} />
              <CardTitle className="text-lg">{status.title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {listingCount} listings
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-background rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-background border rounded px-2 py-1"
              >
                <option value="price">Sort by Price</option>
                <option value="mileage">Sort by Mileage</option>
                <option value="distance">Sort by Distance</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{status.description}</p>
        </CardHeader>
      </Card>

      {/* Listings */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
      }`}>
        <AnimatePresence>
          {sortedListings.map((listing, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              {viewMode === 'grid' ? (
                <ListingCard listing={listing} />
              ) : (
                <ListingRow listing={listing} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {listings.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllListings(!showAllListings)}
            className="flex items-center gap-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${
              showAllListings ? 'rotate-180' : ''
            }`} />
            {showAllListings 
              ? 'Show Less' 
              : `Show All ${listings.length} Listings`
            }
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function ListingCard({ listing }: { listing: MarketListing }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 group">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ${listing.price.toLocaleString()}
            </span>
            {listing.source && (
              <Badge variant="outline" className="text-xs">
                {listing.source}
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {listing.mileage && (
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>{listing.mileage.toLocaleString()} miles</span>
              </div>
            )}
            
            {listing.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
                {listing.distance && (
                  <span className="text-xs">({listing.distance} mi away)</span>
                )}
              </div>
            )}

            {(listing.dealer || listing.dealerName || listing.dealer_name) && (
              <div className="text-xs font-medium truncate" title={listing.dealer || listing.dealerName || listing.dealer_name}>
                {listing.dealer || listing.dealerName || listing.dealer_name}
              </div>
            )}
          </div>

          {/* Link */}
          {(listing.url || listing.link || listing.listingUrl || listing.listing_url) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => window.open(listing.url || listing.link || listing.listingUrl || listing.listing_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ListingRow({ listing }: { listing: MarketListing }) {
  return (
    <Card className="hover:shadow-sm transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-xl font-bold text-green-600 w-24">
              ${listing.price.toLocaleString()}
            </span>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {listing.mileage && (
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>{listing.mileage.toLocaleString()} mi</span>
                </div>
              )}
              
              {listing.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              )}
              
              {(listing.dealer || listing.dealerName || listing.dealer_name) && (
                <span className="text-xs font-medium max-w-32 truncate">
                  {listing.dealer || listing.dealerName || listing.dealer_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {listing.source && (
              <Badge variant="outline" className="text-xs">
                {listing.source}
              </Badge>
            )}
            
            {(listing.url || listing.link || listing.listingUrl || listing.listing_url) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(listing.url || listing.link || listing.listingUrl || listing.listing_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}