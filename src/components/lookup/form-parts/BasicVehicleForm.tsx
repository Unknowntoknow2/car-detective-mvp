
import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConditionSelectorSegmented } from '../ConditionSelectorSegmented';
import { ManualEntryFormData } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({
  formData,
  updateFormData,
  errors,
  isPremium = false
}: BasicVehicleFormProps) {
  const { makes, getModelsByMakeId, isLoading, error } = useMakeModels();
  const [models, setModels] = useState<Array<{ id: string; model_name: string }>>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');

  // Find the make ID when formData.make changes
  useEffect(() => {
    if (formData.make && makes.length > 0) {
      const foundMake = makes.find(make => make.make_name === formData.make);
      if (foundMake && foundMake.id !== selectedMakeId) {
        setSelectedMakeId(foundMake.id);
      }
    } else if (!formData.make) {
      setSelectedMakeId('');
    }
  }, [formData.make, makes, selectedMakeId]);

  // Load models when selectedMakeId changes
  const loadModels = useCallback(async (makeId: string) => {
    if (!makeId) {
      setModels([]);
      return;
    }

    try {
      const modelsList = await getModelsByMakeId(makeId);
      setModels(modelsList);
    } catch (error) {
      console.error('Error loading models:', error);
      setModels([]);
    }
  }, [getModelsByMakeId]);

  useEffect(() => {
    if (selectedMakeId) {
      loadModels(selectedMakeId);
    } else {
      setModels([]);
    }
  }, [selectedMakeId, loadModels]);

  const handleMakeChange = (makeId: string) => {
    const selectedMake = makes.find(make => make.id === makeId);
    if (selectedMake) {
      setSelectedMakeId(makeId);
      updateFormData({ 
        make: selectedMake.make_name,
        model: '' // Reset model when make changes
      });
    }
  };

  const handleModelChange = (modelName: string) => {
    updateFormData({ model: modelName });
  };

  const handleYearChange = (year: string) => {
    updateFormData({ year: parseInt(year) });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    updateFormData({ mileage: parseInt(value) || 0 });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  };

  // Generate years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  if (isLoading && makes.length === 0) {
    return <div>Loading vehicle data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading vehicle data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Select
            value={selectedMakeId}
            onValueChange={handleMakeChange}
          >
            <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map(make => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Select
            value={formData.model}
            onValueChange={handleModelChange}
            disabled={!selectedMakeId || models.length === 0}
          >
            <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
              <SelectValue placeholder={!selectedMakeId ? "Select make first" : "Select model"} />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select
            value={formData.year.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className={errors.year ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="text"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="Enter mileage"
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={errors.zipCode ? 'border-red-300' : ''}
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        </div>

        {isPremium && (
          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              type="text"
              value={formData.vin || ''}
              onChange={(e) => updateFormData({ vin: e.target.value.toUpperCase() })}
              placeholder="Enter VIN"
              maxLength={17}
            />
          </div>
        )}
      </div>

      <ConditionSelectorSegmented
        value={formData.condition}
        onChange={(condition) => updateFormData({ condition })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select
            value={formData.fuelType}
            onValueChange={(value) => updateFormData({ fuelType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="flex">Flex Fuel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={formData.transmission}
            onValueChange={(value) => updateFormData({ transmission: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
