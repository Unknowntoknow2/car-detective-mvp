
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

// Primary implementation
const MakeModelSelect: React.FC<MakeModelSelectProps> = ({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isDisabled = false,
}) => {
  const filteredModels = models.filter(m => m.makeId === selectedMakeId);
  
  // Reset model selection when make changes
  useEffect(() => {
    setSelectedModelId('');
  }, [selectedMakeId, setSelectedModelId]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMakeId(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(e.target.value);
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <label htmlFor="make-select" className="block text-sm font-medium text-gray-700">
          Make
        </label>
        <select
          id="make-select"
          value={selectedMakeId}
          onChange={handleMakeChange}
          disabled={isDisabled}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="w-1/2">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <select
          id="model-select"
          value={selectedModelId}
          onChange={handleModelChange}
          disabled={isDisabled || !selectedMakeId}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">
            {!selectedMakeId ? "Select Make First" : "Select Model"}
          </option>
          {filteredModels.map((model) => (
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
export const CommonMakeModelSelect = MakeModelSelect;
export { MakeModelSelect };
export default MakeModelSelect;
