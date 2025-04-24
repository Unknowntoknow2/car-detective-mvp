
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
        <div className="mt-6">
          <VehicleScoring />
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
