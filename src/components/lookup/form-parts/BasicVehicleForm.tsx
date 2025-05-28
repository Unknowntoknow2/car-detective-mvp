
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Loader2, AlertCircle } from 'lucide-react';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({ formData, updateFormData, errors, isPremium }: BasicVehicleFormProps) {
  const { makes, models, isLoading, error, getModelsByMakeId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [loadingModels, setLoadingModels] = useState(false);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  // Fuel type options
  const fuelTypeOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'alternative', label: 'Alternative' }
  ];

  // Handle make selection
  const handleMakeChange = useCallback(async (makeId: string) => {
    console.log('Make changed to:', makeId);
    setSelectedMakeId(makeId);
    
    // Find the make name from the makes array
    const selectedMake = makes.find(make => make.id === makeId);
    const makeName = selectedMake ? selectedMake.make_name : '';
    
    updateFormData({ make: makeName, model: '' }); // Store make name, reset model

    if (makeId) {
      setLoadingModels(true);
      try {
        await getModelsByMakeId(makeId);
        console.log('Models fetched successfully for make:', makeId);
      } catch (err) {
        console.error('Error fetching models:', err);
      } finally {
        setLoadingModels(false);
      }
    }
  }, [updateFormData, getModelsByMakeId, makes]);

  // Handle model selection
  const handleModelChange = useCallback((modelName: string) => {
    console.log('Model changed to:', modelName);
    updateFormData({ model: modelName });
  }, [updateFormData]);

  // Initialize selectedMakeId when formData.make changes
  useEffect(() => {
    if (formData.make && makes.length > 0) {
      const foundMake = makes.find(make => make.make_name === formData.make);
      if (foundMake && foundMake.id !== selectedMakeId) {
        setSelectedMakeId(foundMake.id);
        // Fetch models for this make if we haven't already
        if (models.length === 0) {
          getModelsByMakeId(foundMake.id);
        }
      }
    }
  }, [formData.make, makes, selectedMakeId, models.length, getModelsByMakeId]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to load vehicle data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={handleMakeChange} value={selectedMakeId}>
            <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
              <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
            </SelectTrigger>
            <SelectContent>
              {makes.map(make => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model <span className="text-red-500">*</span>
          </label>
          <Select 
            onValueChange={handleModelChange} 
            value={formData.model}
            disabled={!selectedMakeId || loadingModels}
          >
            <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
              <SelectValue placeholder={
                loadingModels ? "Loading models..." : 
                !selectedMakeId ? "Select make first" : 
                models.length === 0 ? "No models available" : 
                "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingModels && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Loading models...
            </div>
          )}
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
        </div>
      </div>

      {/* Year and Trim Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <Select 
            onValueChange={(value) => updateFormData({ year: parseInt(value) })} 
            value={formData.year?.toString()}
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
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trim (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. LE, XLE, Sport"
            value={formData.trim || ''}
            onChange={(e) => updateFormData({ trim: e.target.value })}
            className={errors.trim ? 'border-red-300' : ''}
          />
          {errors.trim && <p className="text-red-500 text-sm mt-1">{errors.trim}</p>}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Type
        </label>
        <Select 
          onValueChange={(value) => updateFormData({ fuelType: value })} 
          value={formData.fuelType}
        >
          <SelectTrigger className={errors.fuelType ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fuelType && <p className="text-red-500 text-sm mt-1">{errors.fuelType}</p>}
      </div>

      {/* Vehicle Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Vehicle Condition <span className="text-red-500">*</span>
        </label>
        <ConditionSelectorBar 
          value={formData.condition}
          onChange={(condition) => updateFormData({ condition })}
        />
        {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
      </div>
    </div>
  );
}
