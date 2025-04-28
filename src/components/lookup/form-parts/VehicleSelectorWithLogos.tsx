
import { useState, useEffect } from 'react';
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
  const [modelOptions, setModelOptions] = useState<{ value: string, label: string }[]>([]);

  // Effect to update model options when make changes
  useEffect(() => {
    console.log("VehicleSelectorWithLogos: Make changed to:", selectedMake);
    if (selectedMake) {
      const fetchedModels = getModelsByMake(selectedMake) || [];
      const safeModels = Array.isArray(fetchedModels) ? fetchedModels : [];
      const mappedModels = safeModels.map(model => ({
        value: model.model_name,
        label: model.model_name
      }));
      console.log(`VehicleSelectorWithLogos: Found ${mappedModels.length} models for make ${selectedMake}`);
      setModelOptions(mappedModels);
    } else {
      console.log("VehicleSelectorWithLogos: No make selected, clearing models");
      setModelOptions([]);
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

  // Ensure makes is properly mapped to ComboBox items
  const makesOptions = Array.isArray(makes) ? makes.map(make => ({
    value: make.make_name,
    label: make.make_name,
    icon: make.logo_url
  })) : [];

  console.log("VehicleSelectorWithLogos: Makes options:", makesOptions);
  console.log("VehicleSelectorWithLogos: Selected make:", selectedMake);
  console.log("VehicleSelectorWithLogos: Models options:", modelOptions);
  console.log("VehicleSelectorWithLogos: Selected model:", selectedModel);

  return (
    <div className="space-y-4">
      <ComboBox
        items={makesOptions}
        value={selectedMake}
        onChange={(make) => {
          console.log("VehicleSelectorWithLogos: Make selection changed to:", make);
          onMakeChange(make);
        }}
        placeholder="Select a make"
        emptyText="No makes found"
        disabled={disabled}
        className="w-full"
      />
      
      <ComboBox
        items={modelOptions}
        value={selectedModel}
        onChange={(model) => {
          console.log("VehicleSelectorWithLogos: Model selection changed to:", model);
          onModelChange(model);
        }}
        placeholder={selectedMake ? "Select a model" : "Select a make first"}
        emptyText="No models found"
        disabled={!selectedMake || disabled}
        className="w-full"
      />
    </div>
  );
}
