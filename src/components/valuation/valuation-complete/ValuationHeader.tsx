
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

interface ValuationHeaderProps {
  vehicleInfo: VehicleInfo;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export const ValuationHeader: React.FC<ValuationHeaderProps> = ({
  vehicleInfo,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
        <Badge variant="outline" className="ml-2">{vehicleInfo.condition}</Badge>
      </h1>
      
      <Card className="p-4 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Vehicle Details</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <div>
                  <p className="text-muted-foreground">Year:</p>
                  <p className="font-medium">{vehicleInfo.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mileage:</p>
                  <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} miles</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition:</p>
                  <p className="font-medium">{vehicleInfo.condition}</p>
                </div>
                
                {/* Display any additional info if provided */}
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-muted-foreground">{key}:</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
              {isPremium && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mt-2">
                  Premium Report
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuationHeader;
