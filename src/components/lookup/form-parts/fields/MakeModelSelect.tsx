
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { carMakes, getModelsForMake } from '@/utils/carData';

interface MakeModelSelectProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDisabled?: boolean;
}

export const MakeModelSelect: React.FC<MakeModelSelectProps> = ({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  isDisabled = false
}) => {
  const { makes, getModelsByMake, isLoading } = useVehicleData();
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  
  // Fallback to local data if API data is not available
  const displayedMakes = Array.isArray(makes) && makes.length > 0 
    ? makes 
    : carMakes.map(make => ({ 
      id: make, 
      make_name: make,
      logo_url: null 
    }));
  
  useEffect(() => {
    if (selectedMakeId) {
      try {
        // Find the make by ID first
        const selectedMake = displayedMakes.find(make => make.id === selectedMakeId);
        if (selectedMake) {
          const models = getModelsByMake(selectedMake.make_name);
          setAvailableModels(Array.isArray(models) ? models : []);
        } else {
          setAvailableModels([]);
        }
      } catch (error) {
        console.error("Error getting models for make:", error);
        setAvailableModels([]);
      }
    } else {
      setAvailableModels([]);
    }
  }, [selectedMakeId, displayedMakes, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    setSelectedMakeId(value);
    setSelectedModel(''); // Reset selected model when make changes
  };

  return (
    <>
      <Select 
        onValueChange={handleMakeChange} 
        disabled={isDisabled || isLoading}
        value={selectedMakeId}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder="Select Make">
            {selectedMakeId && displayedMakes.find(make => make.id === selectedMakeId)?.make_name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {displayedMakes.map(make => (
            <SelectItem 
              key={make.id} 
              value={make.id}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              <div className="flex items-center">
                {make.logo_url && (
                  <img 
                    src={make.logo_url} 
                    alt={`${make.make_name} logo`} 
                    className="h-6 w-6 mr-2 object-contain"
                  />
                )}
                <span>{make.make_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={setSelectedModel}
        disabled={!selectedMakeId || isDisabled || isLoading}
        value={selectedModel}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder={selectedMakeId ? "Select Model" : "Select make first"} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {selectedMakeId && (
            Array.isArray(availableModels) && availableModels.length > 0 
              ? availableModels.map(model => (
                  <SelectItem 
                    key={model.id} 
                    value={model.model_name}
                    className="py-2.5 cursor-pointer hover:bg-primary/10"
                  >
                    {model.model_name}
                  </SelectItem>
                ))
              : getModelsForMake(selectedMakeId).map(model => (
                  <SelectItem 
                    key={model} 
                    value={model}
                    className="py-2.5 cursor-pointer hover:bg-primary/10"
                  >
                    {model}
                  </SelectItem>
                ))
          )}
        </SelectContent>
      </Select>
    </>
  );
};
