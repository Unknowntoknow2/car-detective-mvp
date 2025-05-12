
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, Car } from 'lucide-react';
import { validateVin } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';

interface EnhancedVinLookupProps {
  value: string;
  onChange: (value: string) => void;
  onLookup: () => void;
  isLoading: boolean;
  error?: string;
  existingVehicle?: any;
}

export function EnhancedVinLookup({
  value,
  onChange,
  onLookup,
  isLoading,
  error,
  existingVehicle
}: EnhancedVinLookupProps) {
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error: string | null }>({
    isValid: false,
    error: null
  });

  useEffect(() => {
    if (value) {
      const result = validateVin(value);
      setValidationResult(result);
    } else {
      setValidationResult({ isValid: false, error: null });
    }
  }, [value]);

  return (
    <div className="space-y-4">
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

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter 17-character VIN"
          className={`font-mono text-base tracking-wider h-12 ${
            error ? 'border-red-300 focus-visible:ring-red-200' :
            validationResult.isValid ? 'border-green-300 focus-visible:ring-green-200' : ''
          }`}
          maxLength={17}
        />
        {validationResult.isValid && !isLoading && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
      </div>

      {validationResult.error ? (
        <div className="flex items-start gap-2 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{validationResult.error}</p>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.</p>
        </div>
      )}

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
            "Look up Vehicle"
          )}
        </Button>
      </div>
    </div>
  );
}
