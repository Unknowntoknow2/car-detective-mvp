
import React, { useEffect } from 'react';

export interface MakeModelSelectProps {
  makes: { id: string; name: string }[];
  models: { id: string; name: string; makeId: string }[];
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  isDisabled?: boolean;
}

const MakeModelSelect: React.FC<MakeModelSelectProps> = ({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isDisabled = false,
}) => {
  console.log('MakeModelSelect render:', { 
    selectedMakeId, 
    selectedModelId,
    makesCount: makes.length,
    modelsCount: models.length 
  });
  
  // Filter models based on selected make
  const filteredModels = models.filter(model => model.makeId === selectedMakeId);
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

  return (
    <div className="flex space-x-4">
      {/* Make Dropdown */}
      <div className="flex-1">
        <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
        <select
          id="make"
          value={selectedMakeId}
          onChange={handleMakeChange}
          disabled={isDisabled}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">Select a make</option>
          {makes.map(make => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>
      </div>
      {/* Model Dropdown */}
      <div className="flex-1">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
        <select
          id="model"
          value={selectedModelId}
          onChange={handleModelChange}
          disabled={isDisabled || !selectedMakeId}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">
            {!selectedMakeId ? "Select Make First" : "Select Model"}
          </option>
          {filteredModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
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
