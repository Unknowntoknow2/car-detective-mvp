
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { VehicleDetailsForm } from '../../form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { ValuationErrorState } from './ValuationErrorState';

type Stage = 'initial' | 'lookup_in_progress' | 'lookup_failed' | 'vehicle_found' | 'details_required' | 'valuation_in_progress' | 'valuation_complete' | 'valuation_failed';

interface ValuationStagesProps {
  stage: Stage;
  vehicleInfo: any | null;
  requiredInputs: any | null;
  valuationResult: any | null;
  error: string | null;
  isLoading: boolean;
  onDetailsSubmit: (details: any) => Promise<void>;
  initialContent: React.ReactNode;
}

export function ValuationStages({
  stage,
  vehicleInfo,
  requiredInputs,
  valuationResult,
  error,
  isLoading,
  onDetailsSubmit,
  initialContent
}: ValuationStagesProps) {
  if (stage === 'initial' || stage === 'lookup_in_progress' || stage === 'lookup_failed') {
    return initialContent;
  }
  
  if (stage === 'details_required') {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Vehicle Found!</h3>
              <p className="text-green-700">
                {vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}
                {vehicleInfo?.trim && ` ${vehicleInfo.trim}`}
              </p>
            </div>
          </div>
        </div>
        
        {requiredInputs && (
          <VehicleDetailsForm
            initialData={requiredInputs}
            onSubmit={onDetailsSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }
  
  if (stage === 'valuation_complete') {
    return (
      <ValuationResults
        estimatedValue={valuationResult?.estimated_value || 0}
        confidenceScore={valuationResult?.confidence_score || 0}
        basePrice={valuationResult?.base_price}
        adjustments={valuationResult?.adjustments}
        priceRange={valuationResult?.price_range}
        demandFactor={valuationResult?.zip_demand_factor}
        vehicleInfo={{
          year: vehicleInfo?.year || 0,
          make: vehicleInfo?.make || '',
          model: vehicleInfo?.model || '',
          trim: vehicleInfo?.trim || '',
          mileage: requiredInputs?.mileage || undefined,
          condition: requiredInputs?.conditionLabel
        }}
      />
    );
  }
  
  if (stage === 'valuation_failed') {
    return (
      <ValuationErrorState 
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  return null;
}
