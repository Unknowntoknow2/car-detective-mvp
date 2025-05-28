
import React, { useEffect, useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  lookupVehicle: (vin: string) => Promise<boolean>;
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
  goToNextStep
}: VehicleIdentificationStepProps) {
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
    }
    
    // Set a consistent condition value for manual entries
    setFormData(prev => ({
      ...prev,
      condition: ConditionLevel.Good
    }));
    
    goToNextStep();
  };

  return (
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
  );
}
