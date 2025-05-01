
import React from 'react';
import { useVpicVinLookup } from '@/hooks/useVpicVinLookup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Database, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/formatters';

interface VpicVinLookupProps {
  vin: string;
}

export function VpicVinLookup({ vin }: VpicVinLookupProps) {
  const { data, loading, error, source, fetchedAt, refresh } = useVpicVinLookup(vin);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading vehicle data from NHTSA...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" /> 
            Error Loading NHTSA Data
          </CardTitle>
          <CardDescription>
            Unable to fetch vehicle information from NHTSA database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-destructive">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={refresh} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">NHTSA vPIC Data</CardTitle>
            <CardDescription>
              Official vehicle information from NHTSA database
            </CardDescription>
          </div>
          <Badge variant={source === 'cache' ? 'outline' : 'default'}>
            {source === 'cache' ? (
              <Database className="mr-1 h-3 w-3" />
            ) : (
              <Info className="mr-1 h-3 w-3" />
            )}
            {source === 'cache' ? 'Cached' : 'Latest'} Data
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-1">Basic Information</h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Make:</span>
                <span className="text-sm font-medium">{data.make || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Model:</span>
                <span className="text-sm font-medium">{data.model || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Year:</span>
                <span className="text-sm font-medium">{data.modelYear || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Vehicle Type:</span>
                <span className="text-sm font-medium">{data.vehicleType || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Body Class:</span>
                <span className="text-sm font-medium">{data.bodyClass || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Doors:</span>
                <span className="text-sm font-medium">{data.doors || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Series/Trim:</span>
                <span className="text-sm font-medium">{data.series || data.trim || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-1">Technical Specifications</h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Drive Type:</span>
                <span className="text-sm font-medium">{data.driveType || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Fuel Type:</span>
                <span className="text-sm font-medium">{data.fuelType || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Engine Size:</span>
                <span className="text-sm font-medium">
                  {data.engineSize ? `${data.engineSize}L` : 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Cylinders:</span>
                <span className="text-sm font-medium">{data.engineCylinders || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Transmission:</span>
                <span className="text-sm font-medium">{data.transmissionStyle || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">GVWR:</span>
                <span className="text-sm font-medium">{data.grossVehicleWeight || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-muted-foreground">Manufacturer:</span>
                <span className="text-sm font-medium">{data.manufacturer || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {data.note && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Note: </span>
              {data.note}
            </p>
          </div>
        )}
        
        {fetchedAt && (
          <div className="mt-4 text-xs text-muted-foreground text-right">
            Data {source === 'cache' ? 'cached' : 'fetched'} {formatRelativeTime(new Date(fetchedAt))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/30 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          className="gap-1"
          disabled={loading}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Data
        </Button>
      </CardFooter>
    </Card>
  );
}
