
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

interface MakeModelSelectProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDisabled?: boolean;
}

export function MakeModelSelect({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  isDisabled
}: MakeModelSelectProps) {
  const { makes, isLoading } = useVehicleData();
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  
  // Use the getModelsByMakeId function directly
  useEffect(() => {
    const fetchModels = async () => {
      if (selectedMakeId) {
        try {
          // Find the make object
          const selectedMake = makes.find(make => make.id === selectedMakeId);
          if (selectedMake) {
            // Import directly to avoid circular dependency
            const { getModelsByMakeId } = await import('@/api/vehicleApi');
            const models = await getModelsByMakeId(selectedMakeId);
            console.log(`Fetched ${models.length} models for make ${selectedMake.make_name} (ID: ${selectedMakeId})`);
            setAvailableModels(models);
          }
        } catch (error) {
          console.error('Error fetching models:', error);
          setAvailableModels([]);
        }
      } else {
        setAvailableModels([]);
      }
    };
    
    fetchModels();
  }, [selectedMakeId, makes]);

  return (
    <>
      <Select 
        value={selectedMakeId} 
        onValueChange={(value) => {
          console.log("Selected make ID:", value);
          setSelectedMakeId(value);
          setSelectedModel(''); // Reset model when make changes
        }}
        disabled={isDisabled || isLoading}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder="Select Make" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {makes.map(make => (
            <SelectItem 
              key={make.id} 
              value={make.id}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              {make.make_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedModel}
        onValueChange={setSelectedModel}
        disabled={!selectedMakeId || isDisabled || isLoading}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder={selectedMakeId ? "Select Model" : "Select make first"} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {availableModels.map(model => (
            <SelectItem 
              key={model.id} 
              value={model.model_name}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              {model.model_name}
            </SelectItem>
          ))}
          {selectedMakeId && availableModels.length === 0 && (
            <div className="p-2 text-center text-muted-foreground">
              {isLoading ? "Loading models..." : "No models available"}
            </div>
          )}
        </SelectContent>
      </Select>
    </>
  );
}
