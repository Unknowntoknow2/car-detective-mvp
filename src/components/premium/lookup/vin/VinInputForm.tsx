
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { validateVinEnhanced } from '@/utils/validation/enhanced-vin-validation';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { VinSchema } from '@/utils/validation/schemas';

interface VinInputFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function VinInputForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error
}: VinInputFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

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
    onChange(newValue);
  };

  const handleSubmit = async () => {
    try {
      VinSchema.parse(value);
      onSubmit();
    } catch (err) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
    }
  };

  const isValid = value && !validationError && !isLoading;

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
          <FormValidationError error={validationError} />
        ) : error ? (
          <FormValidationError error={error} />
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
}
