
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

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
  const { makes, getModelsByMake } = useVehicleData();
  
  return (
    <>
      <Select 
        onValueChange={setSelectedMakeId} 
        disabled={isDisabled}
        value={selectedMakeId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Make">
            {selectedMakeId && makes.find(make => make.id === selectedMakeId)?.make_name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {makes.map(make => (
            <SelectItem key={make.id} value={make.id}>
              <div className="flex items-center">
                {make.logo_url && (
                  <img 
                    src={make.logo_url} 
                    alt={`${make.make_name} logo`} 
                    className="h-6 w-6 mr-2 object-contain"
                  />
                )}
                {make.make_name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={setSelectedModel}
        disabled={!selectedMakeId || isDisabled}
        value={selectedModel}
      >
        <SelectTrigger>
          <SelectValue placeholder={selectedMakeId ? "Select Model" : "Select make first"} />
        </SelectTrigger>
        <SelectContent>
          {selectedMakeId && getModelsByMake(selectedMakeId).map(model => (
            <SelectItem key={model.id} value={model.model_name}>
              {model.model_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
