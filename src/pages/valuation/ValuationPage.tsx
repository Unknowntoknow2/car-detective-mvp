
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';

export default function ValuationPage() {
  const { vin } = useParams<{ vin?: string }>();

  const handleVehicleFound = (vehicle: any) => {
    console.log('Vehicle found:', vehicle);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedLookupTabs
            onVehicleFound={handleVehicleFound}
            tier="free"
            defaultTab={vin ? "vin" : "manual"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
