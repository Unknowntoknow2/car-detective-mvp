
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ConditionLevel, ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValidationError } from '@/components/common/ValidationError';
import { Loader2 } from 'lucide-react';

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
  isPremium 
}) => {
  const { 
    makes, 
    models, 
    trims, 
    isLoading, 
    isLoadingModels, 
    isLoadingTrims, 
    getModelsByMakeId, 
    getTrimsByModelId,
    findMakeById,
    findModelById 
  } = useMakeModels();

  // Load models when make changes
  useEffect(() => {
    if (formData.make) {
      console.log('Make changed to:', formData.make, 'Loading models...');
      getModelsByMakeId(formData.make);
    }
  }, [formData.make, getModelsByMakeId]);

  // Load trims when model changes
  useEffect(() => {
    if (formData.model) {
      console.log('Model changed to:', formData.model, 'Loading trims...');
      getTrimsByModelId(formData.model);
    }
  }, [formData.model, getTrimsByModelId]);

  const handleMakeChange = (makeId: string) => {
    console.log('Make selection changed to:', makeId);
    const selectedMake = findMakeById(makeId);
    updateFormData({ 
      make: makeId,
      makeName: selectedMake?.make_name || '',
      model: '', // Clear model when make changes
      modelName: '',
      trim: '', // Clear trim when make changes
      trimName: ''
    });
  };

  const handleModelChange = (modelId: string) => {
    console.log('Model selection changed to:', modelId);
    const selectedModel = findModelById(modelId);
    updateFormData({ 
      model: modelId,
      modelName: selectedModel?.model_name || '',
      trim: '', // Clear trim when model changes
      trimName: ''
    });
  };

  const handleTrimChange = (trimId: string) => {
    console.log('Trim selection changed to:', trimId);
    const selectedTrim = trims.find(trim => trim.id === trimId);
    updateFormData({ 
      trim: trimId,
      trimName: selectedTrim?.trim_name || ''
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || new Date().getFullYear();
    updateFormData({ year: value });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ mileage: value });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
    updateFormData({ zipCode: value });
  };

  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value as ConditionLevel });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading vehicle data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select onValueChange={handleMakeChange} value={formData.make}>
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
          {errors.make && <ValidationError message={errors.make} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select 
            onValueChange={handleModelChange} 
            value={formData.model}
            disabled={!formData.make || isLoadingModels}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoadingModels ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : 
                !formData.make ? "Select make first" : 
                "Select model"
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
          {errors.model && <ValidationError message={errors.model} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year"
            type="number" 
            placeholder="e.g. 2020" 
            value={formData.year || ''}
            onChange={handleYearChange}
          />
          {errors.year && <ValidationError message={errors.year} />}
        </div>
      </div>

      {/* Trim Selection - Only show if model is selected and trims are available */}
      {formData.model && (
        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level (Optional)</Label>
          <Select 
            onValueChange={handleTrimChange} 
            value={formData.trim || ''}
            disabled={isLoadingTrims}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoadingTrims ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading trims...
                  </div>
                ) : 
                trims.length === 0 ? "No trims available" :
                "Select trim (optional)"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No specific trim</SelectItem>
              {trims.map((trim) => (
                <SelectItem key={trim.id} value={trim.id}>
                  {trim.trim_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input 
            id="mileage"
            type="number" 
            placeholder="e.g. 50000" 
            value={formData.mileage || ''}
            onChange={handleMileageChange}
          />
          {errors.mileage && <ValidationError message={errors.mileage} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input 
            id="zipCode"
            placeholder="e.g. 90210" 
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            maxLength={5}
          />
          {errors.zipCode && <ValidationError message={errors.zipCode} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select 
          onValueChange={handleConditionChange}
          value={formData.condition}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
            <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
            <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
            <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
            <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
          </SelectContent>
        </Select>
        {errors.condition && <ValidationError message={errors.condition} />}
      </div>
    </div>
  );
};

export default BasicVehicleForm;
