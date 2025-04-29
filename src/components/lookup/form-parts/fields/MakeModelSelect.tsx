
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ErrorBoundary } from '../../ErrorBoundary';

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
  
  // Use data from Supabase via useVehicleData hook
  const displayedMakes = Array.isArray(makes) && makes.length > 0 
    ? makes 
    : [];
  
  useEffect(() => {
    try {
      console.log("MakeModelSelect fields: selectedMakeId changed to", selectedMakeId);
      
      if (selectedMakeId) {
        // Find the make by ID first
        const selectedMake = displayedMakes.find(make => make.id === selectedMakeId);
        if (selectedMake) {
          console.log("MakeModelSelect fields: Found make", selectedMake.make_name);
          const models = getModelsByMake(selectedMake.make_name);
          const safeModels = Array.isArray(models) ? models : [];
          console.log(`MakeModelSelect fields: Found ${safeModels.length} models`);
          setAvailableModels(safeModels);
        } else {
          console.warn("MakeModelSelect fields: Make not found for ID", selectedMakeId);
          setAvailableModels([]);
        }
      } else {
        console.log("MakeModelSelect fields: No make ID selected");
        setAvailableModels([]);
      }
    } catch (error) {
      console.error("Error getting models for make:", error);
      setAvailableModels([]);
    }
  }, [selectedMakeId, displayedMakes, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    try {
      console.log("MakeModelSelect fields: Changing make ID to", value);
      setSelectedMakeId(value);
      setSelectedModel(''); // Reset selected model when make changes
    } catch (error) {
      console.error("Error handling make change:", error);
    }
  };

  return (
    <ErrorBoundary>
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
                      onError={(e) => {
                        console.log("Image load error");
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
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
            {selectedMakeId && Array.isArray(availableModels) && availableModels.length > 0 && 
              availableModels.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.model_name}
                  className="py-2.5 cursor-pointer hover:bg-primary/10"
                >
                  {model.model_name}
                </SelectItem>
              ))
            }
            {selectedMakeId && (!Array.isArray(availableModels) || availableModels.length === 0) && (
              <div className="p-2 text-muted-foreground text-center">No models available</div>
            )}
          </SelectContent>
        </Select>
      </>
    </ErrorBoundary>
  );
};
