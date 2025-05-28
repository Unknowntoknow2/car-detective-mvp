
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ManualEntryFormData } from '../types/manualEntry';

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
  const { makes, models, trims, isLoading, error, getModelsByMakeId, getTrimsByModelId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingTrims, setIsLoadingTrims] = useState(false);

  // Update local state when formData changes
  useEffect(() => {
    if (formData.make) {
      const selectedMake = makes.find(make => make.make_name === formData.make);
      if (selectedMake) {
        setSelectedMakeId(selectedMake.id);
      }
    }
  }, [formData.make, makes]);

  const handleMakeChange = async (makeId: string) => {
    const selectedMake = makes.find(make => make.id === makeId);
    if (selectedMake) {
      setSelectedMakeId(makeId);
      setIsLoadingModels(true);
      
      // Update form data with make name
      updateFormData({ 
        make: selectedMake.make_name,
        model: '', // Reset model when make changes
        trim: ''  // Reset trim when make changes
      });
      
      // Clear previous selections
      setSelectedModelId('');
      
      try {
        await getModelsByMakeId(makeId);
      } catch (err) {
        console.error('Error loading models:', err);
      } finally {
        setIsLoadingModels(false);
      }
    }
  };

  const handleModelChange = async (modelId: string) => {
    const selectedModel = models.find(model => model.id === modelId);
    if (selectedModel) {
      setSelectedModelId(modelId);
      setIsLoadingTrims(true);
      
      // Update form data with model name
      updateFormData({ 
        model: selectedModel.model_name,
        trim: '' // Reset trim when model changes
      });
      
      try {
        await getTrimsByModelId(modelId);
      } catch (err) {
        console.error('Error loading trims:', err);
      } finally {
        setIsLoadingTrims(false);
      }
    }
  };

  const handleTrimChange = (trimName: string) => {
    updateFormData({ trim: trimName });
  };

  const handleFuelTypeChange = (fuelType: string) => {
    updateFormData({ fuelType });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">Loading vehicle data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4 text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Selection */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium text-slate-700">
            Make <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedMakeId} onValueChange={handleMakeChange}>
            <SelectTrigger 
              id="make"
              className={`h-10 transition-all duration-200 ${errors.make ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
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
          {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium text-slate-700">
            Model <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={selectedModelId} 
            onValueChange={handleModelChange}
            disabled={!selectedMakeId || isLoadingModels}
          >
            <SelectTrigger 
              id="model"
              className={`h-10 transition-all duration-200 ${errors.model ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            >
              <SelectValue 
                placeholder={
                  isLoadingModels 
                    ? "Loading models..." 
                    : selectedMakeId 
                      ? "Select model" 
                      : "Select make first"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trim Selection */}
        <div className="space-y-2">
          <Label htmlFor="trim" className="text-sm font-medium text-slate-700">
            Trim
          </Label>
          <Select 
            value={formData.trim || ''} 
            onValueChange={handleTrimChange}
            disabled={!selectedModelId || isLoadingTrims}
          >
            <SelectTrigger 
              id="trim"
              className="h-10 transition-all duration-200 focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            >
              <SelectValue 
                placeholder={
                  isLoadingTrims 
                    ? "Loading trims..." 
                    : selectedModelId 
                      ? "Select trim (optional)" 
                      : "Select model first"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {trims.map(trim => (
                <SelectItem key={trim.id} value={trim.trim_name}>
                  {trim.trim_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700">
            Fuel Type <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.fuelType || ''} onValueChange={handleFuelTypeChange}>
            <SelectTrigger 
              id="fuelType"
              className={`h-10 transition-all duration-200 ${errors.fuelType ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            >
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
          {errors.fuelType && <p className="text-sm text-red-500 mt-1">{errors.fuelType}</p>}
        </div>
      </div>
    </div>
  );
}
