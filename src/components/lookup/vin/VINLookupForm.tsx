<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVinLookup } from './EnhancedVinLookup';
=======
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { isValidVIN } from "@/utils/validation/vin-validation";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VINLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
  readonly?: boolean;
}

<<<<<<< HEAD
export function VINLookupForm({ onVehicleFound, showHeader = true, readonly = false }: VINLookupFormProps) {
  const handleVehicleFound = (vehicle: any) => {
    onVehicleFound?.(vehicle);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">VIN Lookup</CardTitle>
        </CardHeader>
=======
export const VINLookupForm: React.FC<VINLookupFormProps> = ({
  onSubmit,
  isLoading,
  existingVehicle,
  value: externalValue,
  onChange: externalOnChange,
  error: externalError,
  submitButtonText = "Lookup VIN",
}) => {
  const [vin, setVin] = useState(externalValue || "");
  const [error, setError] = useState<string | null>(externalError || null);

  // Update local state when external value changes
  React.useEffect(() => {
    if (externalValue !== undefined && externalValue !== vin) {
      setVin(externalValue);
    }
  }, [externalValue]);

  // Update local error when external error changes
  React.useEffect(() => {
    if (externalError !== undefined) {
      setError(externalError);
    }
  }, [externalError]);

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
    if (externalOnChange) {
      externalOnChange(newVin);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin) {
      setError("VIN is required");
      return;
    }

    if (!isValidVIN(vin)) {
      setError("Invalid VIN format");
      return;
    }

    setError(null);
    onSubmit(vin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          type="text"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => handleVinChange(e.target.value.toUpperCase())}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking Up VIN...
            </>
          )
          : submitButtonText}
      </Button>
      {existingVehicle && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-500">
            Detected Vehicle: {existingVehicle.year} {existingVehicle.make}{" "}
            {existingVehicle.model}
          </p>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      )}
      <CardContent>
        <EnhancedVinLookup 
          onVehicleFound={handleVehicleFound}
          showManualFallback={!readonly}
          readonly={readonly}
        />
      </CardContent>
    </Card>
  );
}
