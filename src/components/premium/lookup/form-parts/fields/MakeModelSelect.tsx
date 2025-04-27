
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

export function MakeModelSelect({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  isDisabled
}: MakeModelSelectProps) {
  const { makes, getModelsByMake, isLoading } = useVehicleData();
  const models = selectedMakeId ? getModelsByMake(selectedMakeId) : [];

  return (
    <>
      <Select 
        value={selectedMakeId} 
        onValueChange={setSelectedMakeId}
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
          {models.map(model => (
            <SelectItem 
              key={model.id} 
              value={model.model_name}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              {model.model_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
