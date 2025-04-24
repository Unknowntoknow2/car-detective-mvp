
import React from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Download, BookmarkPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { VehicleDetailsGrid } from './VehicleDetailsGrid';
import { VehicleScoring } from './VehicleScoring';

interface VehicleInfoCardProps {
  vehicleInfo: DecodedVehicleInfo;
  onDownloadPdf: () => void;
  onSaveValuation?: () => void;
  isSaving?: boolean;
  isUserLoggedIn?: boolean;
}

export const VehicleInfoCard = ({ 
  vehicleInfo, 
  onDownloadPdf, 
  onSaveValuation, 
  isSaving = false,
  isUserLoggedIn = false 
}: VehicleInfoCardProps) => {
  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        <CardDescription>Details found for VIN: {vehicleInfo.vin}</CardDescription>
      </CardHeader>
      <CardContent>
        <VehicleDetailsGrid vehicleInfo={vehicleInfo} />
        
        <div className="mt-8 pt-6 border-t border-border/60">
          <h3 className="text-lg font-semibold mb-4">Valuation & Scoring</h3>
          <VehicleScoring 
            baseValue={24500}
            valuationBreakdown={[
              {
                factor: "Mileage",
                impact: -3.5,
                description: "Vehicle has higher mileage than average (76,000 mi vs. market avg of 65,000 mi)"
              },
              {
                factor: "Condition",
                impact: 2.0,
                description: "Vehicle condition is above average based on service history and reported condition"
              },
              {
                factor: "Market Demand",
                impact: 4.0,
                description: "This model currently has high demand in your region (based on 30-day sales data)"
              }
            ]}
            confidenceScore={92}
            estimatedValue={24500}
            comparableVehicles={117}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button 
          onClick={onDownloadPdf}
          variant="outline"
        >
          <Download className="mr-2" />
          Download Report
        </Button>
        {isUserLoggedIn && (
          <Button 
            onClick={onSaveValuation}
            disabled={isSaving}
            variant="secondary"
          >
            <BookmarkPlus className="mr-2" />
            {isSaving ? 'Saving...' : 'Save to Dashboard'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
