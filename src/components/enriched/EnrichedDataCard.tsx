
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

interface EnrichedDataCardProps {
  data: EnrichedVehicleData;
  userRole?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
}

export const EnrichedDataCard: React.FC<EnrichedDataCardProps> = ({ 
  data, 
  userRole = 'individual',
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  const isDealerOrAdmin = ['dealer', 'admin'].includes(userRole);
  const statVinData = data.sources.statVin;

  if (!statVinData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            No Market Intelligence Available
          </CardTitle>
          <CardDescription>
            Unable to fetch enrichment data for this vehicle
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Intelligence Report
            </CardTitle>
            <CardDescription>
              Comprehensive auction and damage history for VIN: {data.vin}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(lastUpdated).toLocaleDateString()}
              </div>
            )}
            
            {isDealerOrAdmin && onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Auction History */}
        {statVinData.statVinData?.auctionHistory && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Auction History
            </h3>
            <div className="space-y-3">
              {statVinData.statVinData.auctionHistory.map((auction, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Sale Date</div>
                      <div className="font-semibold">{auction.date}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Price</div>
                      <div className="font-semibold text-green-600">
                        ${auction.price.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Location</div>
                      <div className="font-semibold">{auction.location}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Condition</div>
                      <Badge variant="secondary">{auction.condition}</Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-600">Mileage</div>
                    <div className="font-semibold">{auction.mileage.toLocaleString()} miles</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Damage History */}
        {statVinData.statVinData?.damageHistory && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Damage History
            </h3>
            <div className="space-y-3">
              {statVinData.statVinData.damageHistory.map((damage, index) => (
                <div key={index} className="bg-red-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Type</div>
                      <Badge variant="destructive">{damage.type}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Location</div>
                      <div className="font-semibold">{damage.location}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Severity</div>
                      <div className="font-semibold">{damage.severity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title History */}
        {statVinData.statVinData?.titleHistory && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Title History
            </h3>
            <div className="space-y-3">
              {statVinData.statVinData.titleHistory.map((title, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">State</div>
                      <div className="font-semibold">{title.state}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Type</div>
                      <Badge variant="secondary">{title.type}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Date</div>
                      <div className="font-semibold">{title.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userRole === 'admin' && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-600 mb-2">Debug Info (Admin Only)</h4>
            <div className="text-xs bg-gray-100 p-3 rounded">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
