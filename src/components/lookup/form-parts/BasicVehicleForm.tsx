
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
    modelListVersion,
    isLoading,
    error,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  } = useMakeModels();

  const handleMakeChange = async (makeId: string) => {
    console.log('🚀 BasicVehicleForm: Make changed to:', {
      makeId,
      makeName: findMakeById(makeId)?.make_name
    });
    
    const selectedMake = findMakeById(makeId);
    const updates = {
      make: makeId,
      makeName: selectedMake?.make_name || '',
      model: '',
      modelName: '',
      trim: '',
      trimName: ''
    };
    
    console.log('📝 BasicVehicleForm: Updating form data with:', updates);
    updateFormData(updates);
    
    // ✅ Fetch models for the selected make
    if (makeId) {
      console.log('🔄 BasicVehicleForm: Calling fetchModelsByMakeId for:', makeId);
      await fetchModelsByMakeId(makeId);
    }
  };

  const handleModelChange = (modelId: string) => {
    console.log('🚀 BasicVehicleForm: Model changed to:', {
      modelId,
      modelName: findModelById(modelId)?.model_name
    });
    
    const selectedModel = findModelById(modelId);
    const updates = {
      model: modelId,
      modelName: selectedModel?.model_name || '',
      trim: '',
      trimName: ''
    };
    
    console.log('📝 BasicVehicleForm: Updating form data with:', updates);
    updateFormData(updates);
  };

  // Load models when component mounts if make is already selected
  useEffect(() => {
    if (formData.make && makes.length > 0) {
      console.log('🔄 BasicVehicleForm: Component mounted with existing make, fetching models for:', formData.make);
      fetchModelsByMakeId(formData.make);
    }
  }, [formData.make, makes.length, fetchModelsByMakeId]);

  // 🔁 React to model list updates
  useEffect(() => {
    console.log('🔁 React detected modelListVersion change:', modelListVersion, 'Models count:', models.length);
  }, [modelListVersion]);

  // Debug log for component state
  console.log('🏠 BasicVehicleForm: Component state:', {
    formDataMake: formData.make,
    formDataModel: formData.model,
    makesCount: makes.length,
    modelsCount: models.length,
    modelListVersion,
    isLoading,
    error,
    sampleMakes: makes.slice(0, 3),
    sampleModels: models.slice(0, 3)
  });

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
