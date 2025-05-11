
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { validateVin } from '@/utils/validation/vin-validation';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';

interface EnhancedVinLookupProps {
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  isLoading?: boolean;
  error?: string;
  existingVehicle?: any;
}

export function EnhancedVinLookup({ 
  value, 
  onChange, 
  onLookup, 
  isLoading = false, 
  error,
  existingVehicle
}: EnhancedVinLookupProps) {
  const [touched, setTouched] = React.useState(false);
  
  const validationResult = React.useMemo(() => {
    if (!value) return { isValid: false, error: null };
    return {
      isValid: validateVin(value).valid,
      error: validateVin(value).message
    };
  }, [value]);

  // If there's existing vehicle data, use that VIN and mark as valid
  useEffect(() => {
    if (existingVehicle?.vin && !value) {
      onChange(existingVehicle.vin);
      setTouched(true);
    }
  }, [existingVehicle, value, onChange]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input 
          value={value}
          onChange={(e) => {
            const newValue = e.target.value.toUpperCase();
            onChange(newValue);
            setTouched(true);
          }}
          placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
          className={`text-lg font-mono tracking-wide h-12 pr-10 transition-all ${
            (touched && !validationResult.isValid) || error ? 'border-red-300 focus-visible:ring-red-200 bg-red-50/30' : 
            validationResult.isValid ? 'border-green-300 focus-visible:ring-green-200 bg-green-50/30' : 
            'border-input/60 hover:border-input'
          }`}
          disabled={isLoading || (existingVehicle && !touched)}
        />
        {validationResult.isValid && !isLoading && !error && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
      </div>
      
      {touched && !validationResult.isValid && validationResult.error ? (
        <div className="flex items-start gap-2 text-xs text-red-500 animate-fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{validationResult.error}</p>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-xs text-red-500 animate-fade-in">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : (
        <VinInfoMessage />
      )}
    </div>
  );
}
