
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VehicleDetailsForm } from '../form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationDetail, setValidationDetail] = useState<string | null>(null);
  const [touched, setTouched] = useState({plate: false, state: false});
  
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
  
  // Enhanced plate validation
  const validatePlate = (plate: string): boolean => {
    if (!plate || plate.length < 2) {
      setValidationError("License plate must be at least 2 characters");
      setValidationDetail("Most states require at least 2 characters for license plates");
      return false;
    }
    
    if (plate.length > 8) {
      setValidationError("License plate cannot exceed 8 characters");
      setValidationDetail("Most states limit license plates to 8 characters");
      return false;
    }
    
    if (!/^[A-Z0-9\-]*$/.test(plate)) {
      setValidationError("License plate can only contain letters, numbers, and hyphens");
      setValidationDetail("Special characters other than hyphens are not allowed");
      return false;
    }
    
    setValidationError(null);
    setValidationDetail(null);
    return true;
  };
  
  useEffect(() => {
    if (touched.plate && plateValue) {
      validatePlate(plateValue);
    }
  }, [plateValue, touched.plate]);
  
  const isFormValid = plateValue && 
                      stateValue && 
                      !validationError &&
                      plateValue.length >= 2 && 
                      plateValue.length <= 8;

  const handlePlateChange = (value: string) => {
    // Convert to uppercase and allow only valid characters
    const formattedValue = value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
    setTouched(prev => ({ ...prev, plate: true }));
    onPlateChange?.(formattedValue);
  };

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

  // Render based on the stage of our pipeline
  const renderContent = () => {
    switch (stage) {
      case 'initial':
      case 'lookup':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                Alternative
              </Badge>
              <p className="text-sm text-slate-500">Simple & Convenient</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Input 
                  value={plateValue}
                  onChange={(e) => handlePlateChange(e.target.value)}
                  placeholder="Enter License Plate (e.g., ABC123)" 
                  className={`text-lg font-mono tracking-wide uppercase h-12 ${
                    (touched.plate && validationError) ? 'border-red-500 focus-visible:ring-red-500' : 
                    (isFormValid) ? 'border-green-500 focus-visible:ring-green-500' : ''
                  }`}
                />
                {isFormValid && !isLoading && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              
              <div className="pt-1">
                <Select
                  value={stateValue}
                  onValueChange={(value) => {
                    setTouched(prev => ({ ...prev, state: true }));
                    onStateChange?.(value);
                  }}
                >
                  <SelectTrigger className={`w-full h-12 ${
                    (!stateValue || !touched.state) ? '' : 'border-green-500 focus-visible:ring-green-500'
                  }`}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value} className="py-3">
                        {state.label} ({state.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {touched.plate && validationError ? (
                <FormValidationError 
                  error={validationError} 
                  details={validationDetail || undefined} 
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
                    Enter your license plate and state. This works best for vehicles registered in the United States.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                className="px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up plate...
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
                  <p className="text-sm text-green-600">
                    Plate: {plateValue} ({stateValue})
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
