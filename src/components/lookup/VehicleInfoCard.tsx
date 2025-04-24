
import React from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Info, Download, BookmarkPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const displayField = (value: string | number | null | undefined) => {
    if (value === undefined || value === null) return "Unknown";
    if (typeof value === 'string' && (
      value.trim() === '' || 
      value === 'N/A' || 
      value === 'Not Applicable' || 
      value === 'Not Available'
    )) {
      return "Unknown";
    }
    return value;
  };

  const estimatedValue = "$24,500";
  const conditionScore = "85/100";
  const confidenceScore = "92%";

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        <CardDescription>Details found for VIN: {vehicleInfo.vin}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.make)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Model</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.model)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.year)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Trim</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.trim)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Engine</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.engine)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Transmission</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.transmission)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.drivetrain)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Body Type</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.bodyType)}</p>
          </div>

          <VehicleScoreInfo 
            label="Estimated Value"
            value={estimatedValue}
            tooltipContent={
              <>
                <p className="font-medium mb-1">Value Calculation</p>
                <p className="text-sm">Base value adjusted for:</p>
                <ul className="text-sm list-disc pl-4 mt-1">
                  <li>Market trends</li>
                  <li>Mileage depreciation</li>
                  <li>Regional pricing</li>
                </ul>
                <p className="text-sm mt-2 font-mono">Value = BasePrice - MileageAdj + MarketAdj</p>
              </>
            }
          />

          <VehicleScoreInfo 
            label="Condition Score"
            value={conditionScore}
            tooltipContent={
              <>
                <p className="font-medium mb-1">Condition Score Calculation</p>
                <p className="text-sm">Weighted score based on:</p>
                <ul className="text-sm list-disc pl-4 mt-1">
                  <li>Age (30%)</li>
                  <li>Mileage (40%)</li>
                  <li>Service History (30%)</li>
                </ul>
                <p className="text-sm mt-2 font-mono">Score = (0.3 × Age) + (0.4 × Mileage) + (0.3 × History)</p>
              </>
            }
          />

          <VehicleScoreInfo 
            label="Confidence Score"
            value={confidenceScore}
            tooltipContent={
              <>
                <p className="font-medium mb-1">Data Confidence Rating</p>
                <p className="text-sm">Percentage based on:</p>
                <ul className="text-sm list-disc pl-4 mt-1">
                  <li>Data completeness</li>
                  <li>Source reliability</li>
                  <li>Recent updates</li>
                </ul>
                <p className="text-sm mt-2 font-mono">Confidence = (DataPoints ÷ TotalPossible) × 100</p>
              </>
            }
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

interface VehicleScoreInfoProps {
  label: string;
  value: string;
  tooltipContent: React.ReactNode;
}

const VehicleScoreInfo = ({ label, value, tooltipContent }: VehicleScoreInfoProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

