<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';
=======
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Car, CheckCircle2, Loader2 } from "lucide-react";
import { validateVin } from "@/utils/validation/vin-validation";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface EnhancedVinLookupProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
}

<<<<<<< HEAD
export function EnhancedVinLookup({ onSubmit, isLoading }: EnhancedVinLookupProps) {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
=======
export function EnhancedVinLookup({
  value,
  onChange,
  onLookup,
  isLoading,
  error,
  existingVehicle,
}: EnhancedVinLookupProps) {
  // Define validation state with proper typing that matches what we're going to set
  const [validationResult, setValidationResult] = useState<
    { isValid: boolean; error: string | null }
  >({
    isValid: false,
    error: null,
  });

  useEffect(() => {
    if (value) {
      const result = validateVin(value);
      setValidationResult({
        isValid: result.isValid,
        error: result.message || result.error || null,
      });
    } else {
      setValidationResult({ isValid: false, error: null });
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }

    setError(null);
    onSubmit?.(vin);
  };

  return (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter VIN (17 characters)"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setError(null);
              }}
              maxLength={17}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || vin.length < 17}
            className="w-full"
          >
            {isLoading ? 'Looking up...' : 'Lookup VIN'}
          </Button>
        </form>
      </CardContent>
    </Card>
=======
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
                  {existingVehicle.year} {existingVehicle.make}{" "}
                  {existingVehicle.model}
                </h3>
                <p className="text-gray-600">
                  {existingVehicle.trim && `${existingVehicle.trim} • `}
                  {existingVehicle.bodyType && `${existingVehicle.bodyType} • `}
                  {existingVehicle.transmission &&
                    `${existingVehicle.transmission}`}
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
            error
              ? "border-red-300 focus-visible:ring-red-200"
              : validationResult.isValid
              ? "border-green-300 focus-visible:ring-green-200"
              : ""
          }`}
          maxLength={17}
        />
        {validationResult.isValid && !isLoading && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
      </div>

      {validationResult.error
        ? (
          <div className="flex items-start gap-2 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{validationResult.error}</p>
          </div>
        )
        : error
        ? (
          <div className="flex items-start gap-2 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )
        : (
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Find your 17-character VIN on your vehicle registration, insurance
              card, or on the driver's side dashboard.
            </p>
          </div>
        )}

      <div className="flex justify-end">
        <Button
          onClick={onLookup}
          disabled={isLoading || !validationResult.isValid}
          className="px-6"
        >
          {isLoading
            ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up VIN...
              </>
            )
            : (
              "Look up Vehicle"
            )}
        </Button>
      </div>
    </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
