
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Car, Calendar, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { EnrichedVehicleData } from '@/scraping/getEnrichedVehicleData';

interface EnrichedDataCardProps {
  data: EnrichedVehicleData;
}

export function EnrichedDataCard({ data }: EnrichedDataCardProps) {
  const { statVin } = data || {};

  if (!statVin) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            📊 Auction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No auction history found for this vehicle.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          📊 Auction History (STAT.vin)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statVin.salePrice && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Sale Price</p>
                <p className="text-sm text-muted-foreground">${statVin.salePrice}</p>
              </div>
            </div>
          )}
          
          {statVin.auctionDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Auction Date</p>
                <p className="text-sm text-muted-foreground">{statVin.auctionDate}</p>
              </div>
            </div>
          )}
          
          {statVin.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{statVin.location}</p>
              </div>
            </div>
          )}
          
          {statVin.damage && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Damage</p>
                <p className="text-sm text-muted-foreground">{statVin.damage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {statVin.status && (
            <Badge variant="outline">{statVin.status}</Badge>
          )}
          {statVin.condition && (
            <Badge variant="outline">{statVin.condition}</Badge>
          )}
          {statVin.titleType && (
            <Badge variant="outline">{statVin.titleType}</Badge>
          )}
          {statVin.runAndDrive !== undefined && (
            <Badge variant={statVin.runAndDrive ? "default" : "destructive"}>
              {statVin.runAndDrive ? "Runs & Drives" : "Does Not Run"}
            </Badge>
          )}
        </div>

        {/* Vehicle Details */}
        {(statVin.make || statVin.model || statVin.year || statVin.mileage) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Vehicle Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {statVin.make && <span><strong>Make:</strong> {statVin.make}</span>}
              {statVin.model && <span><strong>Model:</strong> {statVin.model}</span>}
              {statVin.year && <span><strong>Year:</strong> {statVin.year}</span>}
              {statVin.mileage && <span><strong>Mileage:</strong> {statVin.mileage}</span>}
              {statVin.bodyType && <span><strong>Body:</strong> {statVin.bodyType}</span>}
              {statVin.engine && <span><strong>Engine:</strong> {statVin.engine}</span>}
              {statVin.transmission && <span><strong>Transmission:</strong> {statVin.transmission}</span>}
              {statVin.fuelType && <span><strong>Fuel:</strong> {statVin.fuelType}</span>}
            </div>
          </div>
        )}

        {/* Auction Images */}
        {statVin.images && statVin.images.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Auction Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {statVin.images.slice(0, 8).map((url, i) => (
                <div key={i} className="relative">
                  <img 
                    src={url} 
                    alt={`Auction photo ${i + 1}`} 
                    className="rounded-md border aspect-square object-cover w-full"
                    loading="lazy"
                  />
                </div>
              ))}
              {statVin.images.length > 8 && (
                <div className="rounded-md border aspect-square bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    +{statVin.images.length - 8} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* External Link */}
        <div className="border-t pt-4">
          <a
            href={`https://stat.vin/vin-decoder/${statVin.vin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View full report on STAT.vin
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
