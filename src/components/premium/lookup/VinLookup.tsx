<<<<<<< HEAD

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';
=======
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Car, CheckCircle2, Loader2 } from "lucide-react";
import { validateVin } from "@/utils/validation/vin-validation";
import { useEffect, useState } from "react";
import { VinInfoMessage } from "@/components/validation/VinInfoMessage";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VinLookupProps {
  value?: string;
  onChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
  existingVehicle?: any;
}

<<<<<<< HEAD
export function VinLookup({ 
  value = '', 
  onChange, 
  onLookup, 
  isLoading, 
  existingVehicle 
}: VinLookupProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateVIN(value);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
=======
export function VinLookup(
  { value = "", onChange, onLookup, isLoading = false, existingVehicle }:
    VinLookupProps,
) {
  const [validationResult, setValidationResult] = useState<
    { isValid: boolean; error: string | null }
  >({
    isValid: false,
    error: null,
  });

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (value) {
      const result = validateVin(value);
      setValidationResult({
        isValid: result.isValid,
        error: result.isValid ? null : result.error || null,
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
        error: null,
      });
    }
  }, [existingVehicle, value]);

  const handleLookupClick = () => {
    if (!validationResult.isValid) {
      toast.error(validationResult.error || "Invalid VIN");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return;
    }

    setError(null);
    onLookup?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange?.(newValue);
    setError(null);
  };

  return (
<<<<<<< HEAD
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter VIN (17 characters)"
            value={value}
            onChange={handleChange}
            maxLength={17}
            className={error ? 'border-red-500' : ''}
=======
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

      <div className="flex items-center gap-2 mb-3">
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 font-medium px-2.5 py-1"
        >
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
              validationResult.error
                ? "border-red-300 focus-visible:ring-red-200 bg-red-50/30"
                : validationResult.isValid
                ? "border-green-300 focus-visible:ring-green-200 bg-green-50/30"
                : "border-input/60 hover:border-input"
            }`}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
<<<<<<< HEAD
        <Button 
          type="submit" 
          disabled={isLoading || value.length < 17}
          className="w-full"
        >
          {isLoading ? 'Looking up...' : 'Lookup VIN'}
=======

        {validationResult.error
          ? (
            <div className="flex items-start gap-2 text-xs text-red-500 animate-fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{validationResult.error}</p>
            </div>
          )
          : <VinInfoMessage />}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleLookupClick}
          disabled={isLoading || !validationResult.isValid}
          className="px-6 h-11 font-medium transition-all"
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </Button>
      </form>
      
      {existingVehicle && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">Vehicle Found</h3>
          <p className="text-green-700">
            {existingVehicle.year} {existingVehicle.make} {existingVehicle.model}
          </p>
        </div>
      )}
    </div>
  );
}
