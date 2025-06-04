<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { FileDown, AlertTriangle } from 'lucide-react';
=======
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DecodedVehicleInfo } from "@/types/vehicle";
import { convertVehicleInfoToReportData, downloadPdf } from "@/utils/pdf";
import { toast } from "sonner";
import { VehicleInfoCard } from "@/components/lookup/VehicleInfoCard";
import { VehicleDetailsForm } from "@/components/premium/form/steps/vehicle-details/VehicleDetailsForm";
import { ValuationResults } from "@/components/valuation/ValuationResults";
import { VehicleFoundCard } from "@/components/premium/lookup/plate/VehicleFoundCard";
import { ValuationErrorState } from "@/components/premium/lookup/shared/ValuationErrorState";
import { CarfaxData } from "@/utils/carfax/mockCarfaxService";
import { convertNewAdjustmentsToLegacyFormat } from "@/utils/formatters/adjustment-formatter";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VinDecoderResultsProps {
  stage: 'initial' | 'processing' | 'complete';
  result: DecodedVehicleInfo | null;
  pipelineVehicle: any | null;
  requiredInputs: any | null;
  valuationResult: any | null;
  valuationError: string | null;
  pipelineLoading: boolean;
  submitValuation: () => Promise<void>;
  vin: string;
  carfaxData: any | null;
  onDownloadPdf: () => void;
}

export default function VinDecoderResults({
  stage,
  result,
  pipelineVehicle,
  requiredInputs,
  valuationResult,
  valuationError,
  pipelineLoading,
  submitValuation,
  vin,
  carfaxData,
<<<<<<< HEAD
  onDownloadPdf
}: VinDecoderResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">VIN</p>
              <p className="font-mono">{vin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Year</p>
              <p>{result.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Make</p>
              <p>{result.make}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p>{result.model}</p>
            </div>
            {result.trim && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trim</p>
                <p>{result.trim}</p>
              </div>
            )}
            {result.engine && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engine</p>
                <p>{result.engine}</p>
              </div>
            )}
            {result.transmission && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                <p>{result.transmission}</p>
              </div>
            )}
            {result.drivetrain && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
                <p>{result.drivetrain}</p>
              </div>
            )}
            {result.bodyType && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Body Type</p>
                <p>{result.bodyType}</p>
              </div>
            )}
          </div>
          
          {stage === 'initial' && (
            <div className="flex justify-end mt-6">
              <Button onClick={submitValuation} disabled={pipelineLoading}>
                Continue to Valuation
              </Button>
            </div>
          )}
          
          {valuationResult && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Estimated Value</h3>
                <Button variant="outline" size="sm" onClick={onDownloadPdf}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <p className="text-3xl font-bold">${valuationResult.estimatedValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Confidence: {valuationResult.confidenceScore}%
              </p>
            </div>
          )}
          
          {valuationError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Valuation Error</p>
                <p className="text-sm text-red-600">{valuationError}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {carfaxData && (
=======
  onDownloadPdf,
}) => {
  const handleDetailsSubmit = async (details: any) => {
    await submitValuation({
      ...details,
      carfaxData: carfaxData || undefined,
    });
  };

  const handleEmailReport = () => {
    toast.success("Email report functionality will be implemented soon!");
  };

  // If we're in the details collection stage, show the pipeline UI
  if (stage === "details_required" && requiredInputs && pipelineVehicle) {
    return (
      <div className="mt-6">
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        <Card>
          <CardHeader>
            <CardTitle>CARFAX® Report Summary</CardTitle>
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-md">
                <p className="text-sm font-medium text-muted-foreground">Owners</p>
                <p className="text-2xl font-bold">{carfaxData.ownerCount || '?'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-md">
                <p className="text-sm font-medium text-muted-foreground">Accidents</p>
                <p className="text-2xl font-bold">{carfaxData.accidentCount || '0'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-md">
                <p className="text-sm font-medium text-muted-foreground">Service Records</p>
                <p className="text-2xl font-bold">{carfaxData.serviceRecordCount || '?'}</p>
              </div>
            </div>
            {carfaxData.reportUrl && (
              <div className="mt-4 text-center">
                <Button variant="link" onClick={() => window.open(carfaxData.reportUrl, '_blank')}>
                  View Full CARFAX® Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
=======
            <VehicleFoundCard
              vehicle={pipelineVehicle}
              plateValue={vin}
              stateValue="US"
            />
            <VehicleDetailsForm
              initialData={requiredInputs}
              onSubmit={handleDetailsSubmit}
              isLoading={pipelineLoading}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If valuation failed, show error
  if (stage === "valuation_failed" && valuationError) {
    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Valuation Error</CardTitle>
          </CardHeader>
          <CardContent>
            <ValuationErrorState
              error={valuationError}
              onRetry={() => submitValuation(requiredInputs!)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If valuation is complete, show the valuation results
  if (stage === "valuation_complete" && valuationResult && pipelineVehicle) {
    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Valuation</CardTitle>
            <CardDescription>
              Based on your vehicle details, here is the estimated value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ValuationResults
              estimatedValue={valuationResult.estimated_value || 0}
              confidenceScore={valuationResult.confidence_score || 0}
              basePrice={valuationResult.base_price}
              adjustments={valuationResult.adjustments}
              priceRange={valuationResult.price_range}
              demandFactor={valuationResult.zip_demand_factor}
              vehicleInfo={{
                year: pipelineVehicle.year || 0,
                make: pipelineVehicle.make || "",
                model: pipelineVehicle.model || "",
                trim: pipelineVehicle.trim,
                mileage: requiredInputs?.mileage,
                condition: requiredInputs?.conditionLabel,
              }}
              onEmailReport={handleEmailReport}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Otherwise, show the traditional lookup results
  if (result) {
    return (
      <VehicleInfoCard
        vehicleInfo={{
          vin: result.vin,
          make: result.make || "",
          model: result.model || "",
          year: result.year || 0,
          trim: result.trim,
          engine: result.engine,
          transmission: "Automatic",
          drivetrain: "FWD",
          bodyType: "Unknown",
        }}
        onDownloadPdf={onDownloadPdf}
        carfaxData={carfaxData}
      />
    );
  }

  return null;
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
