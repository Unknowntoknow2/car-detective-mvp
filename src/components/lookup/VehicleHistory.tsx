
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { carfaxService, CarfaxData } from '@/utils/carfax/carfaxService';

interface VehicleHistoryProps {
  vin: string;
  carfaxData?: CarfaxData | null;
}

export function VehicleHistory({ vin, carfaxData }: VehicleHistoryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CarfaxData | null>(carfaxData || null);

  const handleFetchHistory = async () => {
    setIsLoading(true);
    try {
      const historyData = await carfaxService.getCarfaxData(vin);
      setData(historyData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle History Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get detailed vehicle history information including accidents, ownership, and service records.
          </p>
          <Button onClick={handleFetchHistory} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Vehicle History'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle History Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.accidents}</div>
            <div className="text-sm text-muted-foreground">Accidents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{data.owners}</div>
            <div className="text-sm text-muted-foreground">Owners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{data.serviceRecords}</div>
            <div className="text-sm text-muted-foreground">Service Records</div>
          </div>
          <div className="text-center">
            <Badge variant={data.title === 'Clean' ? 'default' : 'destructive'}>
              {data.title} Title
            </Badge>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={() => window.open(data.reportUrl, '_blank')}
            className="w-full"
          >
            View Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
