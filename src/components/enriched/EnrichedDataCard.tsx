
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, MapPin, DollarSign, AlertTriangle, Shield, Car, FileText, Wrench, Users } from 'lucide-react';
import { EnrichedVehicleData } from '@/enrichment/getEnrichedVehicleData';
import { formatCurrency } from '@/utils/formatCurrency';

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
  const [activeTab, setActiveTab] = useState('overview');
  const statVinData = data.sources.statVin;

  if (!statVinData) {
    return null;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{statVinData.photos.length}</div>
          <div className="text-sm text-blue-700">Photos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{statVinData.auctionSalesHistory.length}</div>
          <div className="text-sm text-green-700">Auction Sales</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-amber-600">{statVinData.ownershipHistory.length}</div>
          <div className="text-sm text-amber-700">Owners</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{statVinData.damageHistory.length}</div>
          <div className="text-sm text-red-700">Damage Events</div>
        </div>
      </div>

      {/* Vehicle Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Vehicle Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Year:</span> {statVinData.vehicleDetails.year}
          </div>
          <div>
            <span className="text-gray-600">Make:</span> {statVinData.vehicleDetails.make}
          </div>
          <div>
            <span className="text-gray-600">Model:</span> {statVinData.vehicleDetails.model}
          </div>
          <div>
            <span className="text-gray-600">Engine:</span> {statVinData.vehicleDetails.engine || 'N/A'}
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {(statVinData.summaries.hasSalvageTitle || statVinData.summaries.hasStructuralDamage) && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-red-800">Critical Issues Found</h3>
          </div>
          <ul className="mt-2 text-red-700 text-sm space-y-1">
            {statVinData.summaries.hasSalvageTitle && <li>• Salvage title reported</li>}
            {statVinData.summaries.hasStructuralDamage && <li>• Structural damage reported</li>}
            {statVinData.summaries.hasAirbagDeployment && <li>• Airbag deployment reported</li>}
          </ul>
        </div>
      )}
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statVinData.photos.map((photo, index) => (
          <div key={index} className="relative">
            <img 
              src={photo.url} 
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            {photo.date && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {photo.date}
              </div>
            )}
            {photo.auction && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                {photo.auction}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAuctionHistory = () => (
    <div className="space-y-4">
      {statVinData.auctionSalesHistory.map((sale, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{sale.auction}</div>
              <div className="text-sm text-gray-600">{sale.date}</div>
              {sale.location && <div className="text-sm text-gray-600">{sale.location}</div>}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatCurrency(sale.price)}</div>
              <Badge variant={sale.status === 'Sold' ? 'default' : 'secondary'}>
                {sale.status}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Lot: {sale.lotNumber}
            {sale.mileage && ` • ${sale.mileage.toLocaleString()} miles`}
          </div>
        </div>
      ))}
    </div>
  );

  const renderOwnershipHistory = () => (
    <div className="space-y-4">
      {statVinData.ownershipHistory.map((owner, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">Owner {owner.ownerNumber}</div>
              <div className="text-sm text-gray-600">Purchased: {owner.yearPurchased}</div>
            </div>
            <Badge variant="outline">{owner.ownerType}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ownership Length:</span> {owner.estimatedOwnershipLength}
            </div>
            {owner.estimatedMilesPerYear && (
              <div>
                <span className="text-gray-600">Miles/Year:</span> {owner.estimatedMilesPerYear.toLocaleString()}
              </div>
            )}
            {owner.lastReportedOdometer && (
              <div className="col-span-2">
                <span className="text-gray-600">Last Odometer:</span> {owner.lastReportedOdometer.toLocaleString()} miles
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDamageHistory = () => (
    <div className="space-y-4">
      {statVinData.damageHistory.map((damage, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{damage.date}</div>
              <div className="text-sm text-gray-600">Owner {damage.owner}</div>
            </div>
            <Badge 
              variant={damage.severity === 'severe' ? 'destructive' : 
                     damage.severity === 'moderate' ? 'secondary' : 'outline'}
            >
              {damage.severity}
            </Badge>
          </div>
          <div className="mb-2">
            <div className="text-sm font-medium">Damage Locations:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {damage.damageLocation.map((location, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-700">{damage.description}</div>
          {damage.repairStatus && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">Repair Status:</span>{' '}
              <Badge variant={damage.repairStatus === 'repaired' ? 'default' : 'secondary'}>
                {damage.repairStatus}
              </Badge>
            </div>
          )}
          {damage.mileage && (
            <div className="text-sm text-gray-600 mt-1">
              Mileage: {damage.mileage.toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTitleHistory = () => (
    <div className="space-y-4">
      {statVinData.titleHistory.map((title, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{title.date}</div>
              <div className="text-sm text-gray-600">{title.state}</div>
            </div>
            <Badge 
              variant={title.titleType === 'Clean' ? 'default' : 'destructive'}
            >
              {title.titleType}
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            {title.titleNumber && (
              <div><span className="text-gray-600">Title #:</span> {title.titleNumber}</div>
            )}
            {title.issuedTo && (
              <div><span className="text-gray-600">Issued To:</span> {title.issuedTo}</div>
            )}
            {title.vehicleColor && (
              <div><span className="text-gray-600">Color:</span> {title.vehicleColor}</div>
            )}
            {title.loanLienReported !== undefined && (
              <div>
                <span className="text-gray-600">Loan/Lien:</span>{' '}
                <Badge variant={title.loanLienReported ? 'secondary' : 'outline'}>
                  {title.loanLienReported ? 'Yes' : 'No'}
                </Badge>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderServiceHistory = () => (
    <div className="space-y-4">
      {statVinData.serviceHistory.map((service, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{service.date}</div>
              <div className="text-sm text-gray-600">{service.serviceProvider}</div>
              <div className="text-sm text-gray-600">{service.location}</div>
            </div>
            {service.mileage && (
              <div className="text-sm text-gray-600">
                {service.mileage.toLocaleString()} miles
              </div>
            )}
          </div>
          <div className="mb-2">
            <div className="text-sm font-medium">Service Types:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {service.serviceType.map((type, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-700">{service.description}</div>
        </div>
      ))}
    </div>
  );

  const renderDetailedHistory = () => (
    <div className="space-y-4">
      {statVinData.detailedHistory.map((event, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-semibold">{event.date}</div>
              <div className="text-sm text-gray-600">{event.source}</div>
            </div>
            <div className="text-right">
              <Badge variant="outline">{event.eventType}</Badge>
              {event.mileage && (
                <div className="text-sm text-gray-600 mt-1">
                  {event.mileage.toLocaleString()} miles
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-700">{event.description}</div>
          {event.location && (
            <div className="text-sm text-gray-600 mt-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              {event.location}
            </div>
          )}
          {event.owner && (
            <div className="text-sm text-gray-600 mt-1">
              Owner {event.owner}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Market Intelligence Report
            </CardTitle>
            <CardDescription>
              Comprehensive vehicle history and market data
            </CardDescription>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
        {lastUpdated && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="overview" className="text-xs">
              <Car className="h-3 w-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">
              Photos ({statVinData.photos.length})
            </TabsTrigger>
            <TabsTrigger value="auction" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              Auctions
            </TabsTrigger>
            <TabsTrigger value="ownership" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Owners
            </TabsTrigger>
            <TabsTrigger value="damage" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Damage
            </TabsTrigger>
            <TabsTrigger value="title" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Title
            </TabsTrigger>
            <TabsTrigger value="service" className="text-xs">
              <Wrench className="h-3 w-3 mr-1" />
              Service
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              Timeline
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">{renderOverview()}</TabsContent>
            <TabsContent value="photos">{renderPhotos()}</TabsContent>
            <TabsContent value="auction">{renderAuctionHistory()}</TabsContent>
            <TabsContent value="ownership">{renderOwnershipHistory()}</TabsContent>
            <TabsContent value="damage">{renderDamageHistory()}</TabsContent>
            <TabsContent value="title">{renderTitleHistory()}</TabsContent>
            <TabsContent value="service">{renderServiceHistory()}</TabsContent>
            <TabsContent value="timeline">{renderDetailedHistory()}</TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
