
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
    isLoading,
    error,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  } = useMakeModels();

  const handleMakeChange = async (makeId: string) => {
    console.log('🔄 Make changed to:', makeId);
    
    const selectedMake = findMakeById(makeId);
    console.log('🏭 Selected make:', selectedMake);
    
    // Clear model selection BEFORE fetching new models
    const updates = {
      make: makeId,
      makeName: selectedMake?.make_name || '',
      model: '',
      modelName: '',
      trim: '',
      trimName: ''
    };
    
    updateFormData(updates);
    
    // Fetch models for the selected make AFTER clearing model selection
    if (makeId) {
      console.log('📞 Calling fetchModelsByMakeId for:', makeId);
      await fetchModelsByMakeId(makeId);
    }
  };

  const handleModelChange = (modelId: string) => {
    console.log('🔄 Model changed to:', modelId);
    
    const selectedModel = findModelById(modelId);
    console.log('🚗 Selected model:', selectedModel);
    
    const updates = {
      model: modelId,
      modelName: selectedModel?.model_name || '',
      trim: '',
      trimName: ''
    };
    
    updateFormData(updates);
  };

  // Load models when component mounts if make is already selected
  useEffect(() => {
    if (formData.make && makes.length > 0) {
      console.log('🔄 Effect: Loading models for existing make:', formData.make);
      fetchModelsByMakeId(formData.make);
    }
  }, [formData.make, makes.length, fetchModelsByMakeId]);

  // Debug logging
  useEffect(() => {
    console.log('📊 BasicVehicleForm state:', {
      makesCount: makes.length,
      modelsCount: models.length,
      selectedMake: formData.make,
      selectedModel: formData.model,
      isLoading,
      error
    });
  }, [makes.length, models.length, formData.make, formData.model, isLoading, error]);

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
        error={error}
        isDisabled={false}
      />
      
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
