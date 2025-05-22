
import React from 'react';
import { useMarketInsights } from '@/hooks/useMarketInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { Loader2, Map, BarChart3, ShoppingCart, Gavel, Car } from 'lucide-react';

interface MarketInsightsTabProps {
  vin: string;
  make: string;
  model: string;
  year: number;
}

export function MarketInsightsTab({ vin, make, model, year }: MarketInsightsTabProps) {
  const { 
    listings, 
    auctions, 
    averagePrices, 
    priceRange, 
    isLoading, 
    error 
  } = useMarketInsights(vin, make, model, year);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Market Data</CardTitle>
          <CardDescription>
            We couldn't retrieve market data for this vehicle. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Fallback message if no data
  if ((!listings || listings.length === 0) && (!auctions || auctions.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Market Data Available</CardTitle>
          <CardDescription>
            We couldn't find any recent listings or auction results for this vehicle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This could be due to the rarity of the vehicle or limited market activity.
            Consider checking again later or widening your search parameters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Price Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Market Price Overview
          </CardTitle>
          <CardDescription>
            Based on {listings.length} listings and {auctions.length} auction results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground">Retail Average</p>
              <p className="text-2xl font-bold">{formatCurrency(averagePrices.retail)}</p>
              <p className="text-xs text-muted-foreground">Dealership listings</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground">Private Party Average</p>
              <p className="text-2xl font-bold">{formatCurrency(averagePrices.private)}</p>
              <p className="text-xs text-muted-foreground">Individual seller listings</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-muted-foreground">Auction Average</p>
              <p className="text-2xl font-bold">{formatCurrency(averagePrices.auction)}</p>
              <p className="text-xs text-muted-foreground">Wholesale auction results</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium">Market Price Range</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{formatCurrency(priceRange.min)}</span>
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: '60%' }} 
                />
              </div>
              <span className="text-sm">{formatCurrency(priceRange.max)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Listings and Auctions Tabs */}
      <Tabs defaultValue="listings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Current Listings
          </TabsTrigger>
          <TabsTrigger value="auctions" className="flex items-center">
            <Gavel className="h-4 w-4 mr-2" />
            Auction History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings" className="mt-4">
          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.slice(0, 5).map((listing, index) => (
                <Card key={index}>
                  <div className="flex flex-col md:flex-row">
                    {listing.image && (
                      <div className="w-full md:w-1/4 p-4">
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="rounded-md object-cover w-full h-32"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{listing.title}</h4>
                        <Badge variant={listing.source === 'craigslist' || listing.source === 'facebook' ? 'outline' : 'default'}>
                          {listing.source}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Map className="h-4 w-4 mr-1" />
                        {listing.location || 'Unknown location'}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Car className="h-4 w-4 mr-1" />
                        {listing.mileage ? `${listing.mileage.toLocaleString()} miles` : 'Mileage not specified'}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xl font-bold">
                          {formatCurrency(listing.price)}
                        </span>
                        {listing.url && (
                          <a 
                            href={listing.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            View Listing
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No current listings found for this vehicle.</p>
          )}
        </TabsContent>
        
        <TabsContent value="auctions" className="mt-4">
          {auctions.length > 0 ? (
            <div className="space-y-4">
              {auctions.slice(0, 5).map((auction, index) => (
                <Card key={index}>
                  <div className="flex flex-col md:flex-row">
                    {auction.photo_urls && auction.photo_urls.length > 0 && (
                      <div className="w-full md:w-1/4 p-4">
                        <img 
                          src={auction.photo_urls[0]} 
                          alt={`${auction.vin} auction`} 
                          className="rounded-md object-cover w-full h-32"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">
                          {auction.source.toUpperCase()} Auction Result
                        </h4>
                        <Badge variant="secondary">
                          {auction.condition_grade || 'Condition Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Map className="h-4 w-4 mr-1" />
                        {auction.location || 'Unknown location'}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Car className="h-4 w-4 mr-1" />
                        {auction.odometer ? `${auction.odometer} miles` : 'Mileage not specified'}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xl font-bold">
                          {formatCurrency(parseFloat(auction.price))}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Sold on {new Date(auction.sold_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No auction history found for this vehicle.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
