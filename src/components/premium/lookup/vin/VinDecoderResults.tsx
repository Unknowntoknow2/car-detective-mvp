
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';
import { VehicleInfoCard } from '@/components/lookup/VehicleInfoCard';
import { VehicleDetailsForm } from '@/components/premium/form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { VehicleFoundCard } from '@/components/premium/lookup/plate/VehicleFoundCard';
import { ValuationErrorState } from '@/components/premium/lookup/shared/ValuationErrorState';
import { CarfaxData } from '@/utils/carfax/mockCarfaxService';

interface VinDecoderResultsProps {
  stage: string;
  result: DecodedVehicleInfo | null;
  pipelineVehicle: any;
  requiredInputs: any;
  valuationResult: any;
  valuationError: any;
  pipelineLoading: boolean;
  submitValuation: (details: any) => Promise<void>;
  vin: string;
  carfaxData: CarfaxData | null;
  onDownloadPdf: () => void;
}

export const VinDecoderResults: React.FC<VinDecoderResultsProps> = ({
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
  onDownloadPdf
}) => {
  
  const handleDetailsSubmit = async (details: any) => {
    await submitValuation({
      ...details,
      carfaxData: carfaxData || undefined
    });
  };

  const handleEmailReport = () => {
    toast.success("Email report functionality will be implemented soon!");
  };

  // If we're in the details collection stage, show the pipeline UI
  if (stage === 'details_required' && requiredInputs && pipelineVehicle) {
    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Additional Vehicle Details</CardTitle>
            <CardDescription>
              Please provide a few more details to get an accurate valuation
            </CardDescription>
          </CardHeader>
          <CardContent>
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
  if (stage === 'valuation_failed' && valuationError) {
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
  if (stage === 'valuation_complete' && valuationResult && pipelineVehicle) {
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
                make: pipelineVehicle.make || '',
                model: pipelineVehicle.model || '',
                trim: pipelineVehicle.trim,
                mileage: requiredInputs?.mileage,
                condition: requiredInputs?.conditionLabel
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
          make: result.make || '',
          model: result.model || '',
          year: result.year || 0,
          trim: result.trim,
          engine: result.engine,
          transmission: result.transmission || 'Automatic', 
          drivetrain: result.drivetrain || 'FWD', 
          bodyType: result.bodyType || 'Unknown' 
        }} 
        onDownloadPdf={onDownloadPdf}
        carfaxData={carfaxData}
      />
    );
  }
  
  return null;
};

export default VinDecoderResults;
