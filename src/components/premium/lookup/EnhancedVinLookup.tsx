
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { validateVinEnhanced } from '@/utils/validation/enhanced-vin-validation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { VinSchema } from '@/utils/validation/schemas';
import { handleApiError } from '@/utils/api/handleApiError';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VehicleDetailsForm } from '../form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

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

  useEffect(() => {
    if (value && touched) {
      try {
        VinSchema.parse(value);
        setValidationError(null);
      } catch (err) {
        if (err instanceof Error) {
          setValidationError(err.message);
        }
      }
    }
  }, [value, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setTouched(true);
    onChange?.(newValue);
  };

  const handleSubmit = async () => {
    try {
      VinSchema.parse(value);
      
      if (onLookup) {
        onLookup(); // Call external onLookup if provided
      }
      
      // Start our valuation pipeline
      await runLookup('vin', value);
    } catch (err) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
    }
  };

  const handleDetailsSubmit = async (details: any) => {
    await submitValuation(details);
  };

  const isValid = value && !validationError && !isLoading;

  // Render based on the stage of our pipeline
  const renderContent = () => {
    switch (stage) {
      case 'initial':
      case 'lookup':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                Recommended
              </Badge>
              <p className="text-sm text-slate-500">Fast & Accurate</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Input 
                  value={value}
                  onChange={handleInputChange}
                  placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
                  className={`text-lg font-mono tracking-wide h-12 pr-10 ${
                    (touched && validationError) ? 'border-red-500 focus-visible:ring-red-500' : 
                    (isValid) ? 'border-green-500 focus-visible:ring-green-500' : ''
                  }`}
                />
                {isValid && !isLoading && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              
              {touched && validationError ? (
                <FormValidationError 
                  error={validationError}
                  variant="error"
                />
              ) : error ? (
                <FormValidationError 
                  error={error} 
                  variant="error"
                />
              ) : (
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>
                    Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up VIN...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Look up Vehicle
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      
      case 'details_required':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Vehicle Found!</h3>
                  <p className="text-green-700">
                    {vehicle?.year} {vehicle?.make} {vehicle?.model}
                    {vehicle?.trim && ` ${vehicle.trim}`}
                  </p>
                </div>
              </div>
            </div>
            
            {requiredInputs && (
              <VehicleDetailsForm
                initialData={requiredInputs}
                onSubmit={handleDetailsSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        );
      
      case 'valuation_complete':
        return (
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
        );
      
      case 'error':
        return (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700">{error || "Failed to process vehicle valuation"}</p>
                <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderContent();
}
