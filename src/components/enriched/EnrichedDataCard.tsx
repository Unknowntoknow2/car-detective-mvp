import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, ExternalLink, Car, DollarSign, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { EnrichedVehicleData } from '@/enrichment/types';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface EnrichedDataCardProps {
  data: EnrichedVehicleData;
  userRole: 'individual' | 'dealer' | 'admin';
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
}

export function EnrichedDataCard({ 
  data, 
  userRole, 
  onRefresh, 
  isRefreshing = false,
  lastUpdated 
}: EnrichedDataCardProps) {
  const statVinData = data.sources.statVin;
  const hasAuctionData = !!statVinData;
  
  // Count total marketplace listings
  const marketplaceCount = [
    data.sources.facebook,
    data.sources.craigslist,
    data.sources.ebay,
    data.sources.carsdotcom
  ].reduce((count, listings) => {
    return count + (Array.isArray(listings) ? listings.length : 0);
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Car className="h-5 w-5" />
            Market Intelligence Report
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive auction and marketplace data analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {format(parseISO(lastUpdated), 'MMM d, h:mm a')}
            </span>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Auction Data Section */}
        {hasAuctionData && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Auction History
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {statVinData.salePrice && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Last Sale Price</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(parseFloat(statVinData.salePrice.replace(/[,$]/g, '')))}
                  </p>
                </div>
              )}
              
              {statVinData.auctionDate && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sale Date</p>
                  <p className="font-semibold">{statVinData.auctionDate}</p>
                </div>
              )}
              
              {statVinData.location && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Auction Location</p>
                  <p className="font-semibold">{statVinData.location}</p>
                </div>
              )}
              
              {statVinData.condition && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <Badge variant={statVinData.condition.toLowerCase().includes('salvage') ? 'destructive' : 'secondary'}>
                    {statVinData.condition}
                  </Badge>
                </div>
              )}
            </div>

            {/* Auction Photos */}
            {statVinData.images && statVinData.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Auction Photos</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {statVinData.images.map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Auction photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Data Sections */}
            {statVinData.auctionSalesHistory && statVinData.auctionSalesHistory.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Sales History</p>
                <div className="space-y-2">
                  {statVinData.auctionSalesHistory.map((sale: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="text-sm">{sale.date} - {sale.location}</span>
                      <span className="font-medium">{formatCurrency(parseFloat(sale.price))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {statVinData.ownershipHistory && statVinData.ownershipHistory.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Ownership History</p>
                <div className="space-y-2">
                  {statVinData.ownershipHistory.map((owner: any, index: number) => (
                    <div key={index} className="p-2 bg-muted/30 rounded">
                      <p className="text-sm">{owner.owner} ({owner.period})</p>
                      <p className="text-xs text-muted-foreground">{owner.usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Damage History */}
            {statVinData.damageHistory && statVinData.damageHistory.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Damage History
                </p>
                <div className="space-y-2">
                  {statVinData.damageHistory.map((damage: any, index: number) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{damage.type}</p>
                          <p className="text-xs text-muted-foreground">{damage.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="text-xs">{damage.severity}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{damage.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marketplace Data Section */}
        <Separator />
        
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Marketplace Listings ({marketplaceCount} found)
          </h3>
          
          {marketplaceCount === 0 ? (
            <p className="text-muted-foreground text-sm">No active marketplace listings found for this vehicle.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facebook Marketplace */}
              {data.sources.facebook && data.sources.facebook.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    Facebook Marketplace ({data.sources.facebook.length})
                  </h4>
                  {data.sources.facebook.slice(0, 3).map((listing: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm truncate">{listing.title}</p>
                        <Badge variant="outline">{formatCurrency(listing.price)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{listing.location}</p>
                      {listing.url && (
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Listing
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Other marketplace sources */}
              {data.sources.craigslist && data.sources.craigslist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Craigslist ({data.sources.craigslist.length})</h4>
                  {data.sources.craigslist.slice(0, 3).map((listing: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm truncate">{listing.title}</p>
                        <Badge variant="outline">{formatCurrency(listing.price)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{listing.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Service History */}
        {statVinData?.serviceHistory && statVinData.serviceHistory.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Service History
              </h3>
              <div className="space-y-2">
                {statVinData.serviceHistory.map((service: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{service.type}</p>
                        <p className="text-xs text-muted-foreground">{service.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{service.date}</p>
                        <p className="text-xs text-muted-foreground">{service.mileage} miles</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional Data for Dealers */}
        {userRole === 'dealer' && hasAuctionData && (
          <>
            <Separator />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-blue-900">Dealer Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Profit Potential</p>
                  <p className="text-blue-600">
                    {statVinData.estimatedRetailValue && statVinData.salePrice ? 
                      formatCurrency(
                        parseFloat(statVinData.estimatedRetailValue) - parseFloat(statVinData.salePrice.replace(/[,$]/g, ''))
                      ) : 'Data unavailable'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Title Types</p>
                  {statVinData.titleHistory?.map((type: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="mr-1 mb-1">
                      {type.status}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Market Events</p>
                  {statVinData.vehicleDetails && (
                    <p className="text-blue-600">
                      {statVinData.auctionSalesHistory?.length || 0} sales tracked
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {!hasAuctionData && marketplaceCount === 0 && (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No enrichment data available for this vehicle.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try refreshing or check back later for updated information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
