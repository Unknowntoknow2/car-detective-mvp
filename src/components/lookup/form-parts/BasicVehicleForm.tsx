
import React from 'react';
import { MakeModelSelect } from '@/components/common/MakeModelSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';

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
  const {
    makes,
    models,
    trims,
    isLoading,
    isLoadingModels,
    isLoadingTrims,
    error,
    getModelsByMakeId,
    getTrimsByModelId
  } = useMakeModels();

  // Handle make selection
  const handleMakeChange = async (makeId: string) => {
    const selectedMake = makes.find(make => make.id === makeId);
    console.log('Make selected:', makeId, selectedMake);
    
    updateFormData({
      make: makeId,
      makeName: selectedMake?.make_name || '',
      model: '', // Reset model when make changes
      modelName: '',
      trim: '', // Reset trim when make changes
      trimName: ''
    });
    
    // Fetch models for the selected make
    if (makeId) {
      await getModelsByMakeId(makeId);
    }
  };

  // Handle model selection
  const handleModelChange = async (modelId: string) => {
    const selectedModel = models.find(model => model.id === modelId);
    console.log('Model selected:', modelId, selectedModel);
    
    updateFormData((prev: ManualEntryFormData) => ({
      ...prev,
      model: modelId,
      modelName: selectedModel?.model_name || '',
      trim: '', // Reset trim when model changes
      trimName: ''
    }));
    
    // Fetch trims for the selected model
    if (modelId) {
      await getTrimsByModelId(modelId);
    }
  };

  // Handle trim selection
  const handleTrimChange = (trimId: string) => {
    const selectedTrim = trims.find(trim => trim.id === trimId);
    console.log('Trim selected:', trimId, selectedTrim);
    
    updateFormData((prev: ManualEntryFormData) => ({
      ...prev,
      trim: trimId,
      trimName: selectedTrim?.trim_name || ''
    }));
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value) || new Date().getFullYear();
    updateFormData((prev: ManualEntryFormData) => ({ ...prev, year }));
  };

  // Handle mileage change
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mileage = parseInt(e.target.value) || 0;
    updateFormData({ mileage });
  };

  // Handle ZIP code change
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode });
  };

  // Handle condition change
  const handleConditionChange = (condition: string) => {
    updateFormData({ condition: condition as ConditionLevel });
  };

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: string) => {
    updateFormData({ fuelType });
  };

  // Handle transmission change
  const handleTransmissionChange = (transmission: string) => {
    updateFormData({ transmission });
  };

  return (
    <div className="space-y-6">
      {/* Make and Model Selection */}
      <MakeModelSelect
        makes={makes}
        models={models}
        selectedMakeId={formData.make}
        setSelectedMakeId={handleMakeChange}
        selectedModelId={formData.model}
        setSelectedModelId={handleModelChange}
        isLoading={isLoading}
        isLoadingModels={isLoadingModels}
        error={error}
      />

      {/* Trim Selection (if available) */}
      {formData.model && trims.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trim">Trim (Optional)</Label>
            <Select 
              value={formData.trim || ''} 
              onValueChange={handleTrimChange}
              disabled={isLoadingTrims}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTrims ? "Loading trims..." : "Select trim"} />
              </SelectTrigger>
              <SelectContent>
                {trims.map(trim => (
                  <SelectItem key={trim.id} value={trim.id}>
                    {trim.trim_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Year and Mileage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={handleYearChange}
            min={1900}
            max={new Date().getFullYear() + 1}
            className={errors.year ? 'border-red-500' : ''}
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            min={0}
            placeholder="Enter mileage"
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
        </div>
      </div>

      {/* ZIP Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            maxLength={5}
            placeholder="Enter ZIP code"
            className={errors.zipCode ? 'border-red-500' : ''}
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label>Vehicle Condition</Label>
        <Select value={formData.condition} onValueChange={handleConditionChange}>
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
      </div>

      {/* Fuel Type and Transmission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select value={formData.fuelType || 'gasoline'} onValueChange={handleFuelTypeChange}>
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
          <Label>Transmission</Label>
          <Select value={formData.transmission || 'automatic'} onValueChange={handleTransmissionChange}>
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
