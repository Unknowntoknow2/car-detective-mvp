
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Car, History, AlertTriangle, FileText, Wrench, Calendar } from 'lucide-react';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';

interface EnrichedDataCardProps {
  data: EnrichedVehicleData;
  userRole: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
}

export const EnrichedDataCard: React.FC<EnrichedDataCardProps> = ({
  data,
  userRole,
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  const statVinData = data.sources.statVin;

  if (!statVinData) {
    return (
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Market Intelligence
          </CardTitle>
          <CardDescription>No enrichment data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTitleTypeColor = (titleType: string) => {
    switch (titleType.toLowerCase()) {
      case 'clean': return 'bg-green-100 text-green-800';
      case 'salvage': return 'bg-red-100 text-red-800';
      case 'reconstructed': return 'bg-orange-100 text-orange-800';
      case 'flood': return 'bg-blue-100 text-blue-800';
      case 'lemon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-800">STAT.vin Market Intelligence</CardTitle>
              <CardDescription className="text-blue-700">
                Comprehensive vehicle history and auction data
              </CardDescription>
            </div>
          </div>
          {(userRole === 'dealer' || userRole === 'admin') && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-blue-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-800">{statVinData.summaries.ownerCount}</div>
            <div className="text-xs text-blue-600">Owners</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-800">{statVinData.summaries.auctionSalesCount}</div>
            <div className="text-xs text-blue-600">Auction Sales</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-800">{statVinData.summaries.damageRecordsCount}</div>
            <div className="text-xs text-blue-600">Damage Records</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-800">{statVinData.summaries.serviceRecordsCount}</div>
            <div className="text-xs text-blue-600">Service Records</div>
          </div>
        </div>

        {/* Critical Alerts */}
        {(statVinData.summaries.hasSalvageTitle || statVinData.summaries.hasStructuralDamage) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {statVinData.summaries.hasSalvageTitle && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Salvage Title
              </Badge>
            )}
            {statVinData.summaries.hasStructuralDamage && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Structural Damage
              </Badge>
            )}
            {statVinData.summaries.hasOdometerIssues && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Odometer Issues
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-blue-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auctions">Auctions</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
            <TabsTrigger value="damage">Damage</TabsTrigger>
            <TabsTrigger value="title">Title</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Year:</span>
                    <span className="text-sm font-medium">{statVinData.vehicleDetails.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Make/Model:</span>
                    <span className="text-sm font-medium">{statVinData.vehicleDetails.make} {statVinData.vehicleDetails.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engine:</span>
                    <span className="text-sm font-medium">{statVinData.vehicleDetails.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Drivetrain:</span>
                    <span className="text-sm font-medium">{statVinData.vehicleDetails.drivetrain}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Report Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Records:</span>
                    <span className="text-sm font-medium">{statVinData.summaries.totalRecords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Photos:</span>
                    <span className="text-sm font-medium">{statVinData.summaries.photoCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Report Date:</span>
                    <span className="text-sm font-medium">{formatDate(statVinData.reportDate)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="auctions" className="space-y-4">
            <div className="space-y-3">
              {statVinData.auctionSalesHistory.map((auction, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{auction.auction} - {formatDate(auction.date)}</div>
                        <div className="text-sm text-gray-600">Lot #{auction.lotNumber}</div>
                        {auction.location && (
                          <div className="text-sm text-gray-600">{auction.location}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${auction.price.toLocaleString()}</div>
                        <Badge variant={auction.status === 'Sold' ? 'default' : 'secondary'}>
                          {auction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ownership" className="space-y-4">
            <div className="space-y-3">
              {statVinData.ownershipHistory.map((owner, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Owner {owner.ownerNumber}</div>
                      <Badge variant="outline">{owner.ownerType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Year Purchased:</span>
                        <span className="ml-2 font-medium">{owner.yearPurchased}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ownership Length:</span>
                        <span className="ml-2 font-medium">{owner.estimatedOwnershipLength}</span>
                      </div>
                      {owner.estimatedMilesPerYear && (
                        <div>
                          <span className="text-gray-600">Miles/Year:</span>
                          <span className="ml-2 font-medium">{owner.estimatedMilesPerYear.toLocaleString()}</span>
                        </div>
                      )}
                      {owner.lastReportedOdometer && (
                        <div>
                          <span className="text-gray-600">Last Odometer:</span>
                          <span className="ml-2 font-medium">{owner.lastReportedOdometer.toLocaleString()} mi</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="damage" className="space-y-4">
            <div className="space-y-3">
              {statVinData.damageHistory.map((damage, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{formatDate(damage.date)} - Owner {damage.owner}</div>
                        <div className="text-sm text-gray-600">
                          Damage: {damage.damageLocation.join(', ')}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(damage.severity)}>
                        {damage.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      {damage.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="title" className="space-y-4">
            <div className="space-y-3">
              {statVinData.titleHistory.map((title, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{formatDate(title.date)} - {title.state}</div>
                        {title.titleNumber && (
                          <div className="text-sm text-gray-600">Title #{title.titleNumber}</div>
                        )}
                      </div>
                      <Badge className={getTitleTypeColor(title.titleType)}>
                        {title.titleType}
                      </Badge>
                    </div>
                    {title.vehicleColor && (
                      <div className="text-sm text-gray-600">Color: {title.vehicleColor}</div>
                    )}
                    {title.loanLienReported && (
                      <div className="text-sm text-gray-600">Loan/Lien Reported</div>
                    )}
                    <div className="text-sm text-gray-700 mt-2">
                      {title.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="service" className="space-y-4">
            <div className="space-y-3">
              {statVinData.serviceHistory.map((service, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{service.serviceProvider}</div>
                        <div className="text-sm text-gray-600">{service.location}</div>
                        <div className="text-sm text-gray-600">{formatDate(service.date)}</div>
                      </div>
                      {service.mileage && (
                        <div className="text-sm font-medium">{service.mileage.toLocaleString()} mi</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {service.serviceType.map((type, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-700">
                      {service.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {lastUpdated && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {formatDate(lastUpdated)} • 
            {data.cached ? ' Cached data' : ' Fresh data'} • 
            Powered by STAT.vin
          </div>
        )}
      </CardContent>
    </Card>
  );
};
