
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { validateVin } from '@/utils/validation/vin-validation';
import { useState, useEffect } from 'react';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';

interface VinLookupProps {
  value?: string;
  onChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
}

export function VinLookup({ value = "", onChange, onLookup, isLoading = false }: VinLookupProps) {
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error: string | null }>({
    isValid: false,
    error: null
  });

  useEffect(() => {
    if (value) {
      const result = validateVin(value);
      setValidationResult({
        isValid: result.valid,
        error: result.valid ? null : result.message || null
      });
    } else {
      setValidationResult({ isValid: false, error: null });
    }
  }, [value]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium px-2.5 py-1">
          Recommended
        </Badge>
        <p className="text-sm text-slate-600">Fast & Accurate</p>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <Input 
            value={value}
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase();
              onChange?.(newValue);
            }}
            placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
            className={`text-lg font-mono tracking-wide h-12 pr-10 transition-all ${
              validationResult.error ? 'border-red-300 focus-visible:ring-red-200 bg-red-50/30' : 
              validationResult.isValid ? 'border-green-300 focus-visible:ring-green-200 bg-green-50/30' : 
              'border-input/60 hover:border-input'
            }`}
          />
          {validationResult.isValid && !isLoading && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        
        {validationResult.error ? (
          <div className="flex items-start gap-2 text-xs text-red-500 animate-fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{validationResult.error}</p>
          </div>
        ) : (
          <VinInfoMessage />
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onLookup}
          disabled={isLoading || !validationResult.isValid}
          className="px-6 h-11 font-medium transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up VIN...
            </>
          ) : (
            "Look up Vehicle"
          )}
        </Button>
      </div>
    </div>
  );
}
