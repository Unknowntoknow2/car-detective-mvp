
import { useState } from 'react';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VinInputForm } from './vin/VinInputForm';
import { ValuationStages } from './shared/ValuationStages';

interface EnhancedVinLookupProps {
  value?: string;
  onChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function EnhancedVinLookup({ 
  value = "", 
  onChange, 
  onLookup,
  isLoading: externalLoading = false,
  error: externalError
}: EnhancedVinLookupProps) {
  const [localValue, setLocalValue] = useState(value);

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

  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = async () => {
    if (onLookup) {
      onLookup(); // Call external onLookup if provided
    }
    
    // Start our valuation pipeline
    await runLookup('vin', localValue);
  };

  const handleDetailsSubmit = async (details: any) => {
    await submitValuation(details);
  };

  const vinInputForm = (
    <VinInputForm
      value={localValue}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );

  return (
    <ValuationStages
      stage={stage}
      vehicleInfo={vehicle}
      requiredInputs={requiredInputs}
      valuationResult={valuationResult}
      error={error}
      isLoading={isLoading}
      onDetailsSubmit={handleDetailsSubmit}
      initialContent={vinInputForm}
    />
  );
}
