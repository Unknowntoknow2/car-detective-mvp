
import React, { useEffect } from 'react';

interface Make {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  makeId: string;
}

interface MakeModelSelectProps {
  makes: Make[];
  models: Model[];
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
  isDisabled = false
}) => {
  // Filter models based on selected make
  const filteredModels = models.filter(model => model.makeId === selectedMakeId);
  
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

export default MakeModelSelect;
