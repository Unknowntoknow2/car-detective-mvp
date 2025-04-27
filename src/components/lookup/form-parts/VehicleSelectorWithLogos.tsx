
import React, { useState, useEffect } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ComboBox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleSelectorWithLogosProps {
  selectedMake: string;
  onMakeChange: (make: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export function VehicleSelectorWithLogos({
  selectedMake,
  onMakeChange,
  selectedModel,
  onModelChange,
  disabled = false
}: VehicleSelectorWithLogosProps) {
  const { makes, getModelsByMake, isLoading } = useVehicleData();
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  
  useEffect(() => {
    if (selectedMake) {
      try {
        const models = getModelsByMake(selectedMake);
        setFilteredModels(Array.isArray(models) ? models : []);
      } catch (error) {
        console.error('Error fetching models:', error);
        setFilteredModels([]);
      }
    } else {
      setFilteredModels([]);
    }
  }, [selectedMake, getModelsByMake]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Ensure makes is always an array
  const safeModelOptions = filteredModels.map(model => ({
    value: model.model_name,
    label: model.model_name
  }));

  // Ensure makes is always an array
  const safeMakeOptions = Array.isArray(makes) ? makes.map(make => ({
    value: make.make_name,
    label: make.make_name,
    icon: make.logo_url
  })) : [];

  return (
    <div className="space-y-4">
      <ComboBox
        items={safeMakeOptions}
        value={selectedMake}
        onChange={onMakeChange}
        placeholder="Select a make"
        emptyText="No makes found"
        disabled={disabled}
        className="w-full"
      />
      
      <ComboBox
        items={safeModelOptions}
        value={selectedModel}
        onChange={onModelChange}
        placeholder={selectedMake ? "Select a model" : "Select a make first"}
        emptyText="No models found"
        disabled={!selectedMake || disabled}
        className="w-full"
      />
    </div>
  );
}
