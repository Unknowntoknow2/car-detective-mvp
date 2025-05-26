
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Check, ChevronRight, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/formatters/formatRelativeTime';
import { supabase } from '@/integrations/supabase/client';

export function VpicVinLookup({ vin }: { vin: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  
  const handleLookup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('VpicVinLookup: Calling NHTSA API for VIN:', vin);
      
      const { data: result, error: apiError } = await supabase.functions.invoke('fetch_vpic_data', {
        body: { vin }
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to fetch NHTSA data');
      }

      if (!result?.data) {
        throw new Error('No data returned from NHTSA API');
      }

      setData(result.data);
      setFetchedAt(result.fetched_at || new Date().toISOString());
      console.log('VpicVinLookup: Successfully fetched NHTSA data:', result.data);
      
    } catch (err: any) {
      console.error('VpicVinLookup: Error fetching NHTSA data:', err);
      setError(err.message || 'Failed to retrieve vehicle data from NHTSA');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">NHTSA vPIC Data</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLookup} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              Query NHTSA API
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>NHTSA API Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!data && !error && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Click "Query NHTSA API" to retrieve official vehicle data</p>
            <p className="text-sm">VIN: {vin}</p>
          </CardContent>
        </Card>
      )}
      
      {data && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-600" />
                  {data.modelYear || data.year} {data.make} {data.model}
                </CardTitle>
                <CardDescription>{data.manufacturer}</CardDescription>
              </div>
              {fetchedAt && (
                <Badge variant="outline" className="text-xs">
                  {formatRelativeTime(fetchedAt)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">VIN:</span>
                <p className="font-mono text-xs">{data.vin}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Body Style:</span>
                <p>{data.bodyClass || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Fuel Type:</span>
                <p>{data.fuelType || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Engine:</span>
                <p>{data.engineSize ? `${data.engineSize}L` : 'Not specified'} {data.engineCylinders ? `${data.engineCylinders}-cyl` : ''}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Transmission:</span>
                <p>{data.transmissionStyle || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Drive Type:</span>
                <p>{data.driveType || 'Not specified'}</p>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Made in:</span>
                <p>{data.plantCountry || 'Not specified'}</p>
              </div>
              
              {data.trim && (
                <div>
                  <span className="font-medium text-muted-foreground">Trim:</span>
                  <p>{data.trim}</p>
                </div>
              )}
            </div>
            
            {data.errorCode && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>NHTSA Note</AlertTitle>
                <AlertDescription>{data.errorText || `Error Code: ${data.errorCode}`}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
