
import React from 'react';
import { useNicbVinCheck } from '@/hooks/useNicbVinCheck';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, ShieldAlert, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NicbVinCheckProps {
  vin: string;
  className?: string;
}

export function NicbVinCheck({ vin, className = '' }: NicbVinCheckProps) {
  const { data, loading, error, refresh, source, fetchedAt } = useNicbVinCheck(vin);

  // Format the last updated time
  const lastUpdated = fetchedAt 
    ? formatDistanceToNow(new Date(fetchedAt), { addSuffix: true }) 
    : null;

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error checking VIN status</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.records || data.records.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            No Issues Found
          </CardTitle>
          <CardDescription>
            No theft or salvage records found for this VIN.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center pt-4 text-xs text-muted-foreground">
          {source && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {source === 'api' ? 'NICB API' : 'Cached'}
              </Badge>
              {lastUpdated && <span>Updated {lastUpdated}</span>}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={refresh} className="h-8">
            <RefreshCw className="h-3 w-3 mr-2" />
            Refresh
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // If we have records, display them
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
          NICB Records Found
        </CardTitle>
        <CardDescription>
          This vehicle has {data.records.length} record(s) in the NICB database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.records.map((record, index) => (
            <div key={index} className="bg-muted p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-medium">Status</div>
                  <div className="font-medium">{record.status}</div>
                </div>
                <div>
                  <div className="text-xs font-medium">Date</div>
                  <div>{record.statusDate}</div>
                </div>
                <div>
                  <div className="text-xs font-medium">Make</div>
                  <div>{record.make}</div>
                </div>
                <div>
                  <div className="text-xs font-medium">Model</div>
                  <div>{record.model} ({record.year})</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 text-xs text-muted-foreground">
        {source && (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {source === 'api' ? 'NICB API' : 'Cached'}
            </Badge>
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={refresh} className="h-8">
          <RefreshCw className="h-3 w-3 mr-2" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
