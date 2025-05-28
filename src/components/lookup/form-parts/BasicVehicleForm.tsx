
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';
import { TrimSelector } from './TrimSelector';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export const BasicVehicleForm: React.FC<BasicVehicleFormProps> = ({
  formData,
  updateFormData,
  errors,
  isPremium = false
}) => {
  const { 
    makes, 
    models, 
    trims, 
    isLoading, 
    isLoadingModels, 
    isLoadingTrims,
    error, 
    getModelsByMakeId, 
    getTrimsByModelId,
    findMakeById,
    findModelById
  } = useMakeModels();

  // Fetch models when make changes
  useEffect(() => {
    if (formData.make) {
      console.log('Fetching models for make ID:', formData.make);
      getModelsByMakeId(formData.make);
    }
  }, [formData.make, getModelsByMakeId]);

  // Fetch trims when model changes
  useEffect(() => {
    if (formData.model) {
      console.log('Fetching trims for model ID:', formData.model);
      getTrimsByModelId(formData.model);
    }
  }, [formData.model, getTrimsByModelId]);

  // Update display names when IDs change
  useEffect(() => {
    if (formData.make) {
      const make = findMakeById(formData.make);
      if (make && make.make_name !== formData.makeName) {
        updateFormData({ makeName: make.make_name });
      }
    }
  }, [formData.make, findMakeById, formData.makeName, updateFormData]);

  useEffect(() => {
    if (formData.model) {
      const model = findModelById(formData.model);
      if (model && model.model_name !== formData.modelName) {
        updateFormData({ modelName: model.model_name });
      }
    }
  }, [formData.model, findModelById, formData.modelName, updateFormData]);

  const handleMakeChange = (makeId: string) => {
    console.log('Make changed to:', makeId);
    const make = makes.find(m => m.id === makeId);
    updateFormData({
      make: makeId,
      makeName: make?.make_name || '',
      model: '', // Reset model when make changes
      modelName: '',
      trim: '', // Reset trim when make changes
      trimName: ''
    });
  };

  const handleModelChange = (modelId: string) => {
    console.log('Model changed to:', modelId);
    const model = models.find(m => m.id === modelId);
    updateFormData({
      model: modelId,
      modelName: model?.model_name || '',
      trim: '', // Reset trim when model changes
      trimName: ''
    });
  };

  const handleTrimChange = (trimId: string) => {
    console.log('Trim changed to:', trimId);
    const trim = trims.find(t => t.id === trimId);
    updateFormData({
      trim: trimId,
      trimName: trim?.trim_name || ''
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p>Error loading vehicle data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Selector */}
        <div className="space-y-2">
          <Label htmlFor="make">Make <span className="text-destructive">*</span></Label>
          <Select value={formData.make} onValueChange={handleMakeChange}>
            <SelectTrigger id="make" className={errors.make ? 'border-red-500' : ''}>
              <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-sm text-red-600">{errors.make}</p>}
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <Label htmlFor="model">Model <span className="text-destructive">*</span></Label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!formData.make || isLoadingModels}
          >
            <SelectTrigger id="model" className={errors.model ? 'border-red-500' : ''}>
              <SelectValue placeholder={
                !formData.make 
                  ? "Select make first" 
                  : isLoadingModels 
                    ? "Loading models..." 
                    : "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
        </div>
      </div>

      {/* Year and Mileage Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year Selector */}
        <div className="space-y-2">
          <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
          <Select 
            value={formData.year?.toString()} 
            onValueChange={(value) => updateFormData({ year: parseInt(value) })}
          >
            <SelectTrigger id="year" className={errors.year ? 'border-red-500' : ''}>
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
          {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
        </div>

        {/* Mileage Input */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter mileage"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-sm text-red-600">{errors.mileage}</p>}
        </div>
      </div>

      {/* Trim Selector */}
      {formData.model && (
        <TrimSelector
          trims={trims}
          value={formData.trim || ''}
          onChange={handleTrimChange}
          disabled={!formData.model}
          isLoading={isLoadingTrims}
        />
      )}

      {/* Condition Selector */}
      <div className="space-y-2">
        <Label>Vehicle Condition</Label>
        <ConditionSelectorBar
          value={formData.condition}
          onChange={(condition) => updateFormData({ condition })}
        />
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code <span className="text-destructive">*</span></Label>
        <Input
          id="zipCode"
          type="text"
          placeholder="Enter ZIP code"
          value={formData.zipCode}
          onChange={(e) => updateFormData({ zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
          maxLength={5}
          className={errors.zipCode ? 'border-red-500' : ''}
        />
        {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
      </div>

      {/* Additional fields for premium users */}
      {isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectItem value="flex">Flex Fuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
};
