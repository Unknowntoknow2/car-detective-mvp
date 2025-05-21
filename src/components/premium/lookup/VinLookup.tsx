
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Car } from 'lucide-react';
import { validateVin } from '@/utils/validation/vin-validation';
import { useState, useEffect } from 'react';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export interface VinLookupProps {
  value?: string;
  onChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
  existingVehicle?: any;
}

export function VinLookup({ value = "", onChange, onLookup, isLoading = false, existingVehicle }: VinLookupProps) {
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error: string | null }>({
    isValid: false,
    error: null
  });
  
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const result = validateVin(value);
      setValidationResult({
        isValid: result.isValid,
        error: result.isValid ? null : result.error || null
      });
    } else {
      setValidationResult({ isValid: false, error: null });
    }
  }, [value]);

  // If there's existing vehicle data and VIN matches, mark as valid
  useEffect(() => {
    if (existingVehicle?.vin && existingVehicle.vin === value) {
      setValidationResult({
        isValid: true,
        error: null
      });
    }
  }, [existingVehicle, value]);

  const handleLookupClick = () => {
    if (!validationResult.isValid) {
      toast.error(validationResult.error || 'Invalid VIN');
      return;
    }
    onLookup?.();
  };

  return (
    <div className="space-y-6">
      {existingVehicle && existingVehicle.make && existingVehicle.model && (
        <Card className="border-green-100 bg-green-50/50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Car className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {existingVehicle.year} {existingVehicle.make} {existingVehicle.model}
                </h3>
                <p className="text-gray-600">
                  {existingVehicle.trim && `${existingVehicle.trim} • `}
                  {existingVehicle.bodyType && `${existingVehicle.bodyType} • `}
                  {existingVehicle.transmission && `${existingVehicle.transmission}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You can continue with this vehicle or enter a new VIN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    
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
              setTouched(true);
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
          onClick={handleLookupClick}
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
