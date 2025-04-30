
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { US_STATES } from '../shared/states-data';

interface EnhancedPlateFormProps {
  plateValue: string;
  stateValue: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
}

export function EnhancedPlateForm({
  plateValue,
  stateValue,
  isLoading,
  onPlateChange,
  onStateChange,
  onSubmit,
  error
}: EnhancedPlateFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationDetail, setValidationDetail] = useState<string | null>(null);
  const [touched, setTouched] = useState({ plate: false, state: false });

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
    onPlateChange(formattedValue);
  };

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
              onStateChange(value);
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
          onClick={onSubmit}
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
}
