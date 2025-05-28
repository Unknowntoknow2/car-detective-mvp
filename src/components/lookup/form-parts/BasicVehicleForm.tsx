
import React, { useEffect } from 'react';
import { MakeModelSelect } from '@/components/common/MakeModelSelect';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

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
    getTrimsByModelId,
    findMakeById,
    findModelById,
  } = useMakeModels();

  // Load models when make changes
  useEffect(() => {
    if (formData.make) {
      getModelsByMakeId(formData.make);
    }
  }, [formData.make, getModelsByMakeId]);

  // Load trims when model changes
  useEffect(() => {
    if (formData.model) {
      getTrimsByModelId(formData.model);
    }
  }, [formData.model, getTrimsByModelId]);

  const handleMakeChange = (makeId: string) => {
    const selectedMake = findMakeById(makeId);
    const updates = {
      make: makeId,
      makeName: selectedMake?.make_name || '',
      model: '',
      modelName: '',
      trim: '',
      trimName: ''
    };
    updateFormData(updates);
  };

  const handleModelChange = (modelId: string) => {
    const selectedModel = findModelById(modelId);
    const updates = {
      model: modelId,
      modelName: selectedModel?.model_name || '',
      trim: '',
      trimName: ''
    };
    updateFormData(updates);
  };

  const handleTrimChange = (trimId: string) => {
    const selectedTrim = trims.find(t => t.id === trimId);
    const updates = {
      trim: trimId,
      trimName: selectedTrim?.trim_name || ''
    };
    updateFormData(updates);
  };

  return (
    <div className="space-y-4">
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
      
      {isPremium && trims.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trim (Optional)
          </label>
          <select
            value={formData.trim || ''}
            onChange={(e) => handleTrimChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select trim (optional)</option>
            {trims.map(trim => (
              <option key={trim.id} value={trim.id}>
                {trim.trim_name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {errors.make && (
        <p className="text-red-500 text-sm">{errors.make}</p>
      )}
      {errors.model && (
        <p className="text-red-500 text-sm">{errors.model}</p>
      )}
    </div>
  );
}

export default BasicVehicleForm;
