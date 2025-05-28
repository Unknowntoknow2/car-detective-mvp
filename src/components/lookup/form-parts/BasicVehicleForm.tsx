
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConditionSelectorSegmented } from '../ConditionSelectorSegmented';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';
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
  const { makes, models, isLoading, getModelsByMakeId } = useMakeModels();
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedMakeId, setSelectedMakeId] = useState('');

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  // Handle make selection
  const handleMakeChange = useCallback(async (makeId: string) => {
    console.log('Make selected:', makeId);
    setSelectedMakeId(makeId);
    setLoadingModels(true);
    
    // Clear model selection when make changes
    updateFormData({ 
      make: makeId,
      model: '' // Reset model when make changes
    });
    
    try {
      await getModelsByMakeId(makeId);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoadingModels(false);
    }
  }, [getModelsByMakeId, updateFormData]);

  // Handle model selection
  const handleModelChange = useCallback((modelId: string) => {
    console.log('Model selected:', modelId);
    updateFormData({ model: modelId });
  }, [updateFormData]);

  // Set initial make ID if formData.make exists
  useEffect(() => {
    if (formData.make && formData.make !== selectedMakeId) {
      setSelectedMakeId(formData.make);
      if (formData.make && models.length === 0) {
        handleMakeChange(formData.make);
      }
    }
  }, [formData.make, selectedMakeId, models.length, handleMakeChange]);

  console.log('BasicVehicleForm render:', {
    selectedMakeId,
    modelsCount: models.length,
    loadingModels,
    formDataMake: formData.make,
    formDataModel: formData.model
  });

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Selector */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            Make <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedMakeId}
            onValueChange={handleMakeChange}
            disabled={isLoading}
          >
            <SelectTrigger id="make" className={errors.make ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-xs text-red-500">{errors.make}</p>}
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.model || ''}
            onValueChange={handleModelChange}
            disabled={!selectedMakeId || loadingModels || isLoading}
          >
            <SelectTrigger id="model" className={errors.model ? 'border-red-500' : ''}>
              <SelectValue 
                placeholder={
                  !selectedMakeId 
                    ? "Select make first" 
                    : loadingModels 
                    ? "Loading models..." 
                    : "Select model"
                } 
              />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {models
                .filter(model => model.make_id === selectedMakeId)
                .map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
        </div>
      </div>

      {/* Year and Mileage Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Year <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.year?.toString() || ''}
            onValueChange={(value) => updateFormData({ year: parseInt(value) })}
          >
            <SelectTrigger id="year" className={errors.year ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium">
            Mileage <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g. 45000"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-xs text-red-500">{errors.mileage}</p>}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <ConditionSelectorSegmented
          value={formData.condition}
          onChange={(condition) => updateFormData({ condition })}
        />
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <Label htmlFor="zipCode" className="text-sm font-medium">
          ZIP Code <span className="text-destructive">*</span>
        </Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="Enter ZIP code"
          value={formData.zipCode || ''}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
            updateFormData({ zipCode: value });
          }}
          maxLength={5}
          className={errors.zipCode ? 'border-red-500' : ''}
        />
        {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
        <p className="text-xs text-gray-500">
          Your location helps us determine regional market values
        </p>
      </div>

      {/* Additional Fields for Premium */}
      {isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelType" className="text-sm font-medium">Fuel Type</Label>
            <Select
              value={formData.fuelType || 'gasoline'}
              onValueChange={(value) => updateFormData({ fuelType: value })}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="flex">Flex Fuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transmission" className="text-sm font-medium">Transmission</Label>
            <Select
              value={formData.transmission || 'automatic'}
              onValueChange={(value) => updateFormData({ transmission: value })}
            >
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
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
