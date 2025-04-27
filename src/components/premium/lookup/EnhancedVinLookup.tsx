
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { validateVinEnhanced } from '@/utils/validation/enhanced-vin-validation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

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
  isLoading = false,
  error: externalError
}: EnhancedVinLookupProps) {
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateVinEnhanced>>({ isValid: false });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const result = validateVinEnhanced(value);
      setValidationResult(result);
    } else {
      setValidationResult({ isValid: false });
    }
  }, [value]);

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
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase();
              setTouched(true);
              onChange?.(newValue);
            }}
            placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
            className={`text-lg font-mono tracking-wide h-12 pr-10 ${
              (touched && validationResult.error) ? 'border-red-500 focus-visible:ring-red-500' : 
              (validationResult.isValid && value) ? 'border-green-500 focus-visible:ring-green-500' : ''
            }`}
          />
          {validationResult.isValid && value && !isLoading && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        
        {touched && validationResult.error ? (
          <FormValidationError 
            error={validationResult.error}
            details={validationResult.details}
          />
        ) : externalError ? (
          <FormValidationError 
            error={externalError} 
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
          onClick={onLookup}
          disabled={isLoading || !validationResult.isValid}
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
}
