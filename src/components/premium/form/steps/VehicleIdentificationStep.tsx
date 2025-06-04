<<<<<<< HEAD

import React, { useEffect, useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
=======
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";
import { LookupTabs } from "@/components/premium/lookup/LookupTabs";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
<<<<<<< HEAD
  lookupVehicle: (vin: string) => Promise<boolean>;
=======
  lookupVehicle: (
    type: "vin" | "plate" | "manual" | "photo",
    identifier: string,
    state?: string,
    data?: any,
  ) => Promise<any>;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  isLoading: boolean;
  goToNextStep: () => void;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity,
  lookupVehicle,
  isLoading,
  goToNextStep,
}: VehicleIdentificationStepProps) {
<<<<<<< HEAD
  const [identifierType, setIdentifierType] = useState<string>(formData.identifierType || 'manual');
  const [vin, setVin] = useState<string>(formData.vin || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have the minimum required fields
    const isManualValid = formData.make && formData.model && formData.year;
    const isVinValid = formData.vin && formData.vin.length === 17;
    
    updateValidity(step, identifierType === 'manual' ? !!isManualValid : !!isVinValid);
  }, [formData, identifierType, step, updateValidity]);

  const handleIdentifierTypeChange = (value: string) => {
    setIdentifierType(value);
    setFormData(prev => ({
      ...prev,
      identifierType: value,
      identifier: value === 'vin' ? vin : '',
    }));
=======
  const [lookup, setLookup] = useState<"vin" | "plate" | "manual">(
    formData.identifierType === "manual"
      ? "manual"
      : formData.identifierType === "plate"
      ? "plate"
      : "vin",
  );

  // Validate step when formData changes
  useEffect(() => {
    const isValid = Boolean(formData.make && formData.model && formData.year);
    updateValidity(step, isValid);

    if (isValid) {
      // If we navigate to this step and already have valid data, update step validity
      updateValidity(step, true);
    }
  }, [formData.make, formData.model, formData.year, step, updateValidity]);

  const handleLookupChange = (value: "vin" | "plate" | "manual") => {
    setLookup(value);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setFormData(prev => ({
      ...prev,
      vin: newVin,
      identifierType: 'vin',
      identifier: newVin,
    }));
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'year' || field === 'mileage' ? parseInt(value) || 0 : value,
      identifierType: 'manual',
    }));
  };

  const handleVinLookup = async () => {
    if (vin.length !== 17) {
      setError('Please enter a valid 17-character VIN');
      return;
    }
    
    try {
<<<<<<< HEAD
      const success = await lookupVehicle(vin);
      if (success) {
        goToNextStep();
      }
    } catch (error) {
      setError('Error looking up VIN. Please try again or use manual entry.');
    }
  };

  const handleSubmitManual = () => {
    if (!formData.make || !formData.model || !formData.year) {
      setError('Please fill in all required fields');
      return;
=======
      console.log("Manual submit with data:", data);
      const result = await lookupVehicle(
        "manual",
        "manual-entry",
        undefined,
        data,
      );

      if (result) {
        setFormData((prev) => ({
          ...prev,
          make: data.make || result.make,
          model: data.model || result.model,
          year: data.year || result.year,
          mileage: data.mileage,
          zipCode: data.zipCode,
          condition: data.condition,
          fuelType: data.fuelType,
          transmission: data.transmission,
          trim: data.trim || result.trim,
          bodyType: result.bodyType,
          identifierType: "manual",
          identifier: `${data.year} ${data.make} ${data.model}`,
        }));

        toast.success(`Added: ${data.year} ${data.make} ${data.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      } else {
        // Even if no result from API, still use the manually entered data
        setFormData((prev) => ({
          ...prev,
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          zipCode: data.zipCode,
          condition: data.condition,
          fuelType: data.fuelType,
          transmission: data.transmission,
          trim: data.trim,
          identifierType: "manual",
          identifier: `${data.year} ${data.make} ${data.model}`,
        }));

        toast.success(`Added: ${data.year} ${data.make} ${data.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error("Error submitting manual entry:", error);
      toast.error("Failed to add vehicle details");
    }
  };

  const handleVinLookup = async (vin: string) => {
    try {
      const result = await lookupVehicle("vin", vin);

      if (result) {
        setFormData((prev) => ({
          ...prev,
          vin: vin,
          make: result.make,
          model: result.model,
          year: result.year,
          trim: result.trim,
          bodyType: result.bodyType,
          fuelType: result.fuelType,
          transmission: result.transmission,
          identifierType: "vin",
          identifier: vin,
        }));

        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error("Error looking up VIN:", error);
      toast.error("Failed to look up VIN");
    }
  };

  const handlePlateLookup = async (plate: string, state: string) => {
    try {
      const result = await lookupVehicle("plate", plate, state);

      if (result) {
        setFormData((prev) => ({
          ...prev,
          make: result.make,
          model: result.model,
          year: result.year,
          identifierType: "plate",
          identifier: `${plate} (${state})`,
        }));

        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
        updateValidity(step, true);
        // Proceed to the next step (step 2), not skipping any steps
        goToNextStep();
      }
    } catch (error) {
      console.error("Error looking up plate:", error);
      toast.error("Failed to look up license plate");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
    
    // Set a consistent condition value for manual entries
    setFormData(prev => ({
      ...prev,
      condition: ConditionLevel.Good
    }));
    
    goToNextStep();
  };

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Identification</h2>
        <p className="text-gray-600 mb-6">
          Please enter your vehicle information to get started with your premium valuation.
        </p>
      </div>

      <RadioGroup
        value={identifierType}
        onValueChange={handleIdentifierTypeChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vin" id="vin" />
          <Label htmlFor="vin">Lookup by VIN</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Manual Entry</Label>
        </div>
      </RadioGroup>

      {identifierType === 'vin' ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="vin-input">
              Vehicle Identification Number (VIN) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vin-input"
              placeholder="Enter 17-character VIN"
              value={vin}
              onChange={handleVinChange}
              maxLength={17}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can find your VIN on your insurance card, vehicle registration, or driver's side dashboard.
            </p>
          </div>
          <Button onClick={handleVinLookup} disabled={isLoading}>
            {isLoading ? 'Looking up VIN...' : 'Lookup VIN'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="make">
                Make <span className="text-red-500">*</span>
              </Label>
              <Input
                id="make"
                placeholder="e.g. Toyota"
                value={formData.make || ''}
                onChange={(e) => handleManualInputChange(e, 'make')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                placeholder="e.g. Camry"
                value={formData.model || ''}
                onChange={(e) => handleManualInputChange(e, 'model')}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="year">
                Year <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g. 2018"
                value={formData.year || ''}
                onChange={(e) => handleManualInputChange(e, 'year')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="trim">Trim (Optional)</Label>
              <Input
                id="trim"
                placeholder="e.g. SE, Limited"
                value={formData.trim || ''}
                onChange={(e) => handleManualInputChange(e, 'trim')}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleSubmitManual}>Continue</Button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
=======
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Identify Your Vehicle</h2>
        <p className="text-muted-foreground mb-6">
          Please provide information about your vehicle using one of the methods
          below.
        </p>

        <LookupTabs
          lookup={lookup}
          onLookupChange={handleLookupChange}
          formProps={{
            onSubmit: handleManualSubmit,
            isLoading: isLoading,
            submitButtonText: "Continue",
            onVinLookup: handleVinLookup,
            onPlateLookup: handlePlateLookup,
          }}
        />
      </CardContent>
    </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
