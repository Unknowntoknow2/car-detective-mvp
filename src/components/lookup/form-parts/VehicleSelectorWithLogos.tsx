
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
  const { makes = [], getModelsByMake, isLoading } = useVehicleData();
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

  // Create safe options with explicit empty array fallbacks
  const safeModelOptions = Array.isArray(filteredModels) && filteredModels.length > 0
    ? filteredModels.map(model => ({
        value: model.model_name,
        label: model.model_name
      }))
    : [];

  const safeMakeOptions = Array.isArray(makes) && makes.length > 0
    ? makes.map(make => ({
        value: make.make_name,
        label: make.make_name,
        icon: make.logo_url
      }))
    : [];

  return (
    <div className="space-y-4">
      {/* Only render the ComboBox if we have make options */}
      {safeMakeOptions.length > 0 ? (
        <ComboBox
          items={safeMakeOptions}
          value={selectedMake}
          onChange={onMakeChange}
          placeholder="Select a make"
          emptyText="No makes found"
          disabled={disabled}
          className="w-full"
        />
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
      
      {/* Only render the model ComboBox if we have a selected make and model options */}
      {selectedMake ? (
        safeModelOptions.length > 0 ? (
          <ComboBox
            items={safeModelOptions}
            value={selectedModel}
            onChange={onModelChange}
            placeholder="Select a model"
            emptyText="No models found"
            disabled={!selectedMake || disabled}
            className="w-full"
          />
        ) : (
          <Skeleton className="h-10 w-full" />
        )
      ) : (
        <ComboBox
          items={[]}
          value=""
          onChange={() => {}}
          placeholder="Select a make first"
          emptyText="No models available"
          disabled={true}
          className="w-full"
        />
      )}
    </div>
  );
}
