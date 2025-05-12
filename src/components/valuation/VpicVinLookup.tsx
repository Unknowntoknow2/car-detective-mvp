
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Check, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/utils/formatters';

export function VpicVinLookup({ vin }: { vin: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  
  const handleLookup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      setData({
        make: 'Toyota',
        model: 'Camry',
        year: '2019',
        manufacturer: 'TOYOTA MOTOR CORPORATION',
        plantCountry: 'UNITED STATES',
        bodyClass: 'Sedan/Saloon',
        fuelType: 'Gasoline',
        engineCylinders: '4',
        engineSize: '2.5',
        transmissionStyle: 'Automatic'
      });
      setFetchedAt(new Date().toISOString());
    } catch (err) {
      console.error('Error in VIN lookup:', err);
      setError('Failed to retrieve vehicle data');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">NHTSA vPIC Data</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLookup} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Lookup VIN
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!data && !error && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Click "Lookup VIN" to retrieve official NHTSA vehicle data for VIN: {vin}
          </CardContent>
        </Card>
      )}
      
      {data && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>{data.year} {data.make} {data.model}</CardTitle>
              {fetchedAt && (
                <Badge variant="outline" className="text-xs">
                  {formatRelativeTime(fetchedAt)}
                </Badge>
              )}
            </div>
            <CardDescription>{data.manufacturer}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="font-medium">Body Style:</div>
              <div>{data.bodyClass}</div>
              
              <div className="font-medium">Fuel Type:</div>
              <div>{data.fuelType}</div>
              
              <div className="font-medium">Engine:</div>
              <div>{data.engineSize}L {data.engineCylinders}-cylinder</div>
              
              <div className="font-medium">Transmission:</div>
              <div>{data.transmissionStyle}</div>
              
              <div className="font-medium">Made in:</div>
              <div>{data.plantCountry}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
