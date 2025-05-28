
import React, { useEffect, useCallback, useState } from 'react';
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
  const { makes, models, isLoading, error, getModelsByMakeId } = useMakeModels();
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  // Handle make selection and fetch models
  const handleMakeChange = useCallback(async (makeId: string) => {
    console.log('Make changed to:', makeId);
    updateFormData({ make: makeId, model: '' }); // Reset model when make changes
    
    if (makeId) {
      setLoadingModels(true);
      try {
        const modelsData = await getModelsByMakeId(makeId);
        console.log('Fetched models:', modelsData);
        setAvailableModels(modelsData);
      } catch (err) {
        console.error('Error fetching models:', err);
        setAvailableModels([]);
      } finally {
        setLoadingModels(false);
      }
    } else {
      setAvailableModels([]);
    }
  }, [updateFormData, getModelsByMakeId]);

  // Handle model selection
  const handleModelChange = useCallback((modelName: string) => {
    console.log('Model changed to:', modelName);
    updateFormData({ model: modelName });
  }, [updateFormData]);

  // Handle other field changes
  const handleYearChange = useCallback((year: string) => {
    updateFormData({ year: parseInt(year) });
  }, [updateFormData]);

  const handleMileageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    updateFormData({ mileage: parseInt(value) || 0 });
  }, [updateFormData]);

  const handleZipCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  }, [updateFormData]);

  const handleConditionChange = useCallback((condition: any) => {
    updateFormData({ condition });
  }, [updateFormData]);

  if (isLoading) {
    return <div>Loading vehicle data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading vehicle data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Select value={formData.make || ''} onValueChange={handleMakeChange}>
            <SelectTrigger 
              id="make"
              className={errors.make ? 'border-red-300' : ''}
            >
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

        {/* Model Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Select 
            value={formData.model || ''} 
            onValueChange={handleModelChange}
            disabled={!formData.make || loadingModels || availableModels.length === 0}
          >
            <SelectTrigger 
              id="model"
              className={errors.model ? 'border-red-300' : ''}
            >
              <SelectValue 
                placeholder={
                  !formData.make 
                    ? "Select make first" 
                    : loadingModels 
                    ? "Loading models..." 
                    : availableModels.length === 0
                    ? "No models available"
                    : "Select model"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>
      </div>

      {/* Year and Mileage Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select value={formData.year?.toString() || ''} onValueChange={handleYearChange}>
            <SelectTrigger 
              id="year"
              className={errors.year ? 'border-red-300' : ''}
            >
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

        {/* Mileage Input */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage *</Label>
          <Input
            id="mileage"
            type="text"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="e.g. 45000"
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
        </div>
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code *</Label>
        <Input
          id="zipCode"
          type="text"
          value={formData.zipCode || ''}
          onChange={handleZipCodeChange}
          placeholder="Enter ZIP code"
          maxLength={5}
          className={`max-w-xs ${errors.zipCode ? 'border-red-300' : ''}`}
        />
        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        <p className="text-xs text-gray-500">
          Your location helps us determine regional market values
        </p>
      </div>

      {/* Vehicle Condition */}
      <div className="space-y-2">
        <ConditionSelectorSegmented
          value={formData.condition}
          onChange={handleConditionChange}
        />
        {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
      </div>

      {/* Premium Fields */}
      {isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fuel Type */}
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select 
              value={formData.fuelType || 'gasoline'} 
              onValueChange={(value) => updateFormData({ fuelType: value })}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="flex-fuel">Flex Fuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={formData.transmission || 'automatic'} 
              onValueChange={(value) => updateFormData({ transmission: value })}
            >
              <SelectTrigger id="transmission">
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
      )}
    </div>
  );
}
