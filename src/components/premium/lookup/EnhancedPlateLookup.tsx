
import { useState } from 'react';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VehicleDetailsForm } from '../form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { EnhancedPlateForm } from './plate/EnhancedPlateForm';
import { VehicleFoundCard } from './plate/VehicleFoundCard';
import { ValuationErrorState } from './shared/ValuationErrorState';
import { motion } from 'framer-motion';

interface EnhancedPlateLookupProps {
  plateValue?: string;
  stateValue?: string;
  isLoading?: boolean;
  onPlateChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onLookup?: () => void;
  error?: string;
}

export function EnhancedPlateLookup({ 
  plateValue = "", 
  stateValue = "", 
  isLoading: externalLoading = false, 
  onPlateChange, 
  onStateChange, 
  onLookup,
  error: externalError
}: EnhancedPlateLookupProps) {
  const {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    isLoading: pipelineLoading,
    error: pipelineError,
    runLookup,
    submitValuation
  } = useFullValuationPipeline();

  const isLoading = externalLoading || pipelineLoading;
  const error = externalError || pipelineError;
  
  const handleSubmit = async () => {
    if (!plateValue || !stateValue) return;
    
    if (onLookup) {
      onLookup(); // Call external onLookup if provided
    }
    
    // Start our valuation pipeline
    await runLookup('plate', plateValue, stateValue);
  };

  const handleDetailsSubmit = async (details: any) => {
    await submitValuation(details);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Render based on the stage of our pipeline
  const renderContent = () => {
    if (stage === 'initial' || stage === 'lookup_in_progress' || stage === 'lookup_failed') {
      return (
        <EnhancedPlateForm
          plateValue={plateValue}
          stateValue={stateValue}
          isLoading={isLoading}
          onPlateChange={onPlateChange || (() => {})}
          onStateChange={onStateChange || (() => {})}
          onSubmit={handleSubmit}
          error={error}
        />
      );
    }
    
    if (stage === 'details_required') {
      return (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VehicleFoundCard 
            vehicle={vehicle || {}}
            plateValue={plateValue}
            stateValue={stateValue}
          />
          
          {requiredInputs && (
            <VehicleDetailsForm
              initialData={requiredInputs}
              onSubmit={handleDetailsSubmit}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      );
    }
    
    if (stage === 'valuation_complete') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ValuationResults
            estimatedValue={valuationResult?.estimated_value || 0}
            confidenceScore={valuationResult?.confidence_score || 0}
            basePrice={valuationResult?.base_price}
            adjustments={valuationResult?.adjustments}
            priceRange={valuationResult?.price_range}
            demandFactor={valuationResult?.zip_demand_factor}
            vehicleInfo={{
              year: vehicle?.year || 0,
              make: vehicle?.make || '',
              model: vehicle?.model || '',
              trim: vehicle?.trim || '',
              mileage: requiredInputs?.mileage || undefined,
              condition: requiredInputs?.conditionLabel
            }}
          />
        </motion.div>
      );
    }
    
    if (stage === 'valuation_failed') {
      return (
        <ValuationErrorState 
          error={error}
          onRetry={handleRetry}
        />
      );
    }
    
    return null;
  };

  return renderContent();
}
