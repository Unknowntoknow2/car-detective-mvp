
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { validateVinEnhanced } from '@/utils/validation/enhanced-vin-validation';

interface EnhancedVinLookupProps {
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function EnhancedVinLookup({
  value,
  onChange,
  onLookup,
  isLoading,
  error
}: EnhancedVinLookupProps) {
  // Updated the type definition to match what validateVinEnhanced returns
  const [validationResult, setValidationResult] = useState<{ 
    isValid: boolean; 
    error: string | null;
    details?: string | null;
  }>({ isValid: false, error: null });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value && touched) {
      const result = validateVinEnhanced(value);
      // Ensure result.error is always a string or null to match our state type
      setValidationResult({
        isValid: result.isValid,
        error: result.error || null,
        details: result.details || null
      });
    }
  }, [value, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setTouched(true);
    onChange(newValue);
  };

  const isValid = value && validationResult.isValid && !isLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium px-2.5 py-1 transition-all animate-fade-in">
          Recommended
        </Badge>
        <p className="text-sm text-slate-600">Fast & Accurate</p>
      </div>
      
      <div className="space-y-3">
        <div className="relative group">
          <Input 
            value={value}
            onChange={handleInputChange}
            placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
            className={`text-lg font-mono tracking-wide h-12 pr-10 transition-all duration-300 
              ${(touched && validationResult.error) ? 'border-red-300 focus-visible:ring-red-200/50 bg-red-50/30 shadow-[0_0_0_1px_rgba(244,63,94,0.2)]' : 
              (isValid) ? 'border-green-300 focus-visible:ring-green-200/50 bg-green-50/30 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]' : 
              'group-hover:border-primary/50 focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'}`}
          />
          {isValid && !isLoading && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 animate-scale-in" />
          )}
          <div className="absolute inset-0 pointer-events-none rounded-md transition-opacity opacity-0 group-hover:opacity-100 ring-1 ring-primary/30"></div>
        </div>
        
        {touched && validationResult.error ? (
          <FormValidationError 
            error={validationResult.error}
            details={validationResult.details || undefined}
            className="animate-fade-in"
          />
        ) : error ? (
          <FormValidationError 
            error={error} 
            variant="error"
            className="animate-fade-in"
          />
        ) : (
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onLookup}
          disabled={!isValid || isLoading}
          className="px-6 h-11 font-medium transition-all duration-300 shadow-sm hover:shadow relative overflow-hidden group"
        >
          {isLoading ? (
            <>
              <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Looking up VIN...</span>
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Look up Vehicle</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white/30 group-hover:w-full transition-all duration-300"></span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
