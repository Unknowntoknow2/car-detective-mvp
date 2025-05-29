
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

  const handleMakeChange = (makeId: string) => {
    console.log('BasicVehicleForm: Make changed to:', makeId);
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
    
    // Load models for the selected make
    if (makeId) {
      fetchModelsByMakeId(makeId);
    }
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

  // Load models when component mounts if make is already selected
  useEffect(() => {
    if (formData.make) {
      fetchModelsByMakeId(formData.make);
    }
  }, [formData.make, fetchModelsByMakeId]);

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
        onMakeChange={handleMakeChange}
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
