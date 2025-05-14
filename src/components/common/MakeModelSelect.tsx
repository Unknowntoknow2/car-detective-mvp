
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { VehicleMake, VehicleModel } from '@/hooks/useMakeModels';

interface MakeModelSelectProps {
  makes: VehicleMake[];
  models: VehicleModel[];
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const MakeModelSelect: React.FC<MakeModelSelectProps> = ({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isDisabled = false,
  isLoading = false,
}) => {
  console.log('MakeModelSelect render:', { 
    selectedMakeId, 
    selectedModelId,
    makesCount: makes.length,
    modelsCount: models.length 
  });
  
  // Filter models based on selected make
  const filteredModels = models.filter(model => model.make_id === selectedMakeId);
  console.log('Filtered models:', filteredModels, 'makeId:', selectedMakeId);

  // Reset model selection when make changes
  useEffect(() => {
    if (selectedMakeId && selectedModelId) {
      const modelExists = filteredModels.some(model => model.id === selectedModelId);
      if (!modelExists) {
        console.log('Resetting model selection because selected model is not in filtered list');
        setSelectedModelId('');
      }
    }
  }, [selectedMakeId, filteredModels, selectedModelId, setSelectedModelId]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMakeId = e.target.value;
    console.log('Make changed to:', newMakeId);
    setSelectedMakeId(newMakeId);
    // Always reset model selection when make changes
    setSelectedModelId('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModelId = e.target.value;
    console.log('Model changed to:', newModelId);
    setSelectedModelId(newModelId);
  };

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      {/* Make Dropdown */}
      <div className="flex-1">
        <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
        <select
          id="make"
          value={selectedMakeId}
          onChange={handleMakeChange}
          disabled={isDisabled}
          className="bg-white w-full border-2 border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">Select a make</option>
          {makes.map(make => (
            <option key={make.id} value={make.id}>
              {make.make_name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Model Dropdown */}
      <div className="flex-1">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
        <select
          id="model"
          value={selectedModelId}
          onChange={handleModelChange}
          disabled={isDisabled || !selectedMakeId}
          className="bg-white w-full border-2 border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">
            {!selectedMakeId ? "Select Make First" : "Select Model"}
          </option>
          {filteredModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.model_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Named export for backward compatibility
export { MakeModelSelect };
export default MakeModelSelect;
