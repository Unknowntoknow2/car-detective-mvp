
import React from 'react';

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
  const filteredModels = models.filter(m => m.makeId === selectedMakeId);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMakeId(e.target.value);
    // Reset model selection when make changes
    setSelectedModelId('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(e.target.value);
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
