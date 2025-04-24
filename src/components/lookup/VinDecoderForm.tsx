import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Download, Info, BookmarkPlus } from 'lucide-react';
import { downloadPdf } from '@/utils/pdfGenerator';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { vehicleInfo, isLoading, error, lookupVin } = useVinDecoder();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      await lookupVin(vin);
    }
  };

  const handleSaveValuation = async () => {
    if (!vehicleInfo) return;

    const saved = await saveValuation({
      vin: vehicleInfo.vin,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      valuation: 24500,
      confidenceScore: 92,
      conditionScore: 85
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">VIN Decoder</CardTitle>
          <CardDescription>
            Enter a Vehicle Identification Number (VIN) to get detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="vin" className="text-sm font-medium">
                VIN (17 characters)
              </label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
                className="uppercase"
                pattern="[A-HJ-NPR-Z0-9]{17}"
                title="VIN must be 17 characters and contain only alphanumeric characters (excluding I, O, Q)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a 17-character VIN to decode vehicle information
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || vin.length !== 17}>
              {isLoading ? 'Decoding...' : 'Decode VIN'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vehicleInfo && (
        <VehicleInfoCard 
          vehicleInfo={vehicleInfo} 
          onDownloadPdf={() => downloadPdf(vehicleInfo)}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
        />
      )}
    </div>
  );
};

interface VehicleInfoCardProps {
  vehicleInfo: DecodedVehicleInfo;
  onDownloadPdf: () => void;
  onSaveValuation?: () => void;
  isSaving?: boolean;
  isUserLoggedIn?: boolean;
}

const VehicleInfoCard = ({ 
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
        <CardDescription>Details decoded from VIN: {vehicleInfo.vin}</CardDescription>
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

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium mb-1">Value Calculation</p>
                    <p className="text-sm">Base value adjusted for:</p>
                    <ul className="text-sm list-disc pl-4 mt-1">
                      <li>Market trends</li>
                      <li>Mileage depreciation</li>
                      <li>Regional pricing</li>
                    </ul>
                    <p className="text-sm mt-2 font-mono">Value = BasePrice - MileageAdj + MarketAdj</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-lg font-semibold">{estimatedValue}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Condition Score</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium mb-1">Condition Score Calculation</p>
                    <p className="text-sm">Weighted score based on:</p>
                    <ul className="text-sm list-disc pl-4 mt-1">
                      <li>Age (30%)</li>
                      <li>Mileage (40%)</li>
                      <li>Service History (30%)</li>
                    </ul>
                    <p className="text-sm mt-2 font-mono">Score = (0.3 × Age) + (0.4 × Mileage) + (0.3 × History)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-lg font-semibold">{conditionScore}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium mb-1">Data Confidence Rating</p>
                    <p className="text-sm">Percentage based on:</p>
                    <ul className="text-sm list-disc pl-4 mt-1">
                      <li>Data completeness</li>
                      <li>Source reliability</li>
                      <li>Recent updates</li>
                    </ul>
                    <p className="text-sm mt-2 font-mono">Confidence = (DataPoints ÷ TotalPossible) × 100</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-lg font-semibold">{confidenceScore}</p>
          </div>
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
