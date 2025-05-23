
import React, { useState, useEffect } from 'react';
import { useVehicleData, ModelData, TrimData } from '@/hooks/useVehicleData';
import { Loader2 } from 'lucide-react';

interface VehicleDetailsInputsProps {
  make: string;
  setMake: (make: string) => void;
  model: string;
  setModel: (model: string) => void;
  year: number;
  setYear: (year: number) => void;
  mileage: number;
  setMileage: (mileage: number) => void;
  availableModels?: string[];
  trim?: string;
  setTrim?: (trim: string) => void;
  color?: string;
  setColor?: (color: string) => void;
}

export const VehicleDetailsInputs: React.FC<VehicleDetailsInputsProps> = ({
  make,
  setMake,
  model,
  setModel,
  year,
  setYear,
  mileage,
  setMileage,
  trim,
  setTrim,
  color,
  setColor
}) => {
  const { makes, isLoading, getModelsByMake, getTrimsByModel } = useVehicleData();
  const [models, setModels] = useState<ModelData[]>([]);
  const [trims, setTrims] = useState<TrimData[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTrims, setLoadingTrims] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  // Fetch models when make changes
  useEffect(() => {
    if (make) {
      setLoadingModels(true);
      getModelsByMake(make)
        .then(modelData => {
          setModels(modelData);
          setLoadingModels(false);
          
          // Clear model selection when make changes
          if (model) setModel('');
          setSelectedModelId(null);
        })
        .catch(error => {
          console.error('Error fetching models:', error);
          setLoadingModels(false);
        });
    } else {
      setModels([]);
    }
  }, [make, getModelsByMake, setModel]);

  // Fetch trims when model changes
  useEffect(() => {
    if (selectedModelId && setTrim) {
      setLoadingTrims(true);
      getTrimsByModel(selectedModelId)
        .then(trimData => {
          setTrims(trimData);
          setLoadingTrims(false);
          
          // Clear trim selection when model changes
          if (trim) setTrim('');
        })
        .catch(error => {
          console.error('Error fetching trims:', error);
          setLoadingTrims(false);
        });
    } else {
      setTrims([]);
    }
  }, [selectedModelId, getTrimsByModel, trim, setTrim]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    
    // Find the model ID for the selected model
    const modelObj = models.find(m => m.model_name === selectedModel);
    setSelectedModelId(modelObj?.id || null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Make*
          </label>
          <select
            id="make"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          >
            <option value="">Select Make</option>
            {makes.map((makeName) => (
              <option key={makeName} value={makeName}>
                {makeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model*
          </label>
          <div className="relative">
            <select
              id="model"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={model}
              onChange={handleModelChange}
              disabled={!make || loadingModels}
              required
            >
              <option value="">Select Model</option>
              {models.map((modelItem) => (
                <option key={modelItem.id} value={modelItem.model_name}>
                  {modelItem.model_name}
                </option>
              ))}
            </select>
            {loadingModels && (
              <div className="absolute right-2 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {setTrim && (
        <div>
          <label htmlFor="trim" className="block text-sm font-medium text-gray-700 mb-1">
            Trim
          </label>
          <div className="relative">
            <select
              id="trim"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={trim || ''}
              onChange={(e) => setTrim(e.target.value)}
              disabled={!model || loadingTrims}
            >
              <option value="">Select Trim</option>
              {trims.map((trimItem) => (
                <option key={trimItem.id} value={trimItem.trim_name}>
                  {trimItem.trim_name}
                </option>
              ))}
            </select>
            {loadingTrims && (
              <div className="absolute right-2 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year*
          </label>
          <select
            id="year"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
          >
            <option value="">Select Year</option>
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
            Mileage*
          </label>
          <input
            id="mileage"
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            min="0"
            required
          />
        </div>
      </div>

      {setColor && (
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            id="color"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={color || ''}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Blue, Silver, Black"
          />
        </div>
      )}
    </div>
  );
};
