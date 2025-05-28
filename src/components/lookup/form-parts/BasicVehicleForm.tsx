
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  console.log('BasicVehicleForm render:', {
    makesCount: makes.length,
    modelsCount: models.length,
    selectedMake: formData.make,
    selectedModel: formData.model,
    isLoading,
    error
  });

  // When make changes, fetch models and reset model selection
  useEffect(() => {
    if (formData.make) {
      console.log('Make changed, fetching models for:', formData.make);
      getModelsByMakeId(formData.make);
      // Reset model when make changes
      if (formData.model) {
        updateFormData({ model: '' });
      }
    }
  }, [formData.make, getModelsByMakeId]);

  const handleMakeChange = (makeId: string) => {
    console.log('Make selected:', makeId);
    updateFormData({ 
      make: makeId,
      model: '' // Reset model when make changes
    });
  };

  const handleModelChange = (modelId: string) => {
    console.log('Model selected:', modelId);
    updateFormData({ model: modelId });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value) || '';
    updateFormData({ year });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Selection */}
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Select value={formData.make} onValueChange={handleMakeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!formData.make || isLoading}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !formData.make 
                    ? "Select make first" 
                    : isLoading 
                    ? "Loading models..." 
                    : "Select model"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {models.length > 0 ? (
                models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  {formData.make ? "No models found" : "Select make first"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
          {error && <p className="text-sm text-red-500">Error loading models: {error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year Input */}
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select 
            value={formData.year?.toString() || ''} 
            onValueChange={(value) => updateFormData({ year: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        {/* Trim Input */}
        <div className="space-y-2">
          <Label htmlFor="trim">Trim</Label>
          <Input
            id="trim"
            type="text"
            value={formData.trim || ''}
            onChange={(e) => updateFormData({ trim: e.target.value })}
            placeholder="e.g., LX, Sport, Premium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fuel Type */}
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={formData.fuelType} onValueChange={(value) => updateFormData({ fuelType: value })}>
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

        {/* Transmission */}
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select value={formData.transmission} onValueChange={(value) => updateFormData({ transmission: value })}>
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

      {/* Debug Info in Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-gray-100 rounded text-xs">
          <p>Debug: Makes loaded: {makes.length}</p>
          <p>Debug: Models loaded: {models.length}</p>
          <p>Debug: Selected make ID: {formData.make}</p>
          <p>Debug: Selected model ID: {formData.model}</p>
          <p>Debug: Loading: {isLoading.toString()}</p>
          {error && <p>Debug: Error: {error}</p>}
        </div>
      )}
    </div>
  );
}
