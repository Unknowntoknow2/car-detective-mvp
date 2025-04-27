
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
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  
  useEffect(() => {
    if (selectedMake && getModelsByMake) {
      const models = getModelsByMake(selectedMake);
      setFilteredModels(Array.isArray(models) ? models : []);
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
  const safeMakes = Array.isArray(makes) ? makes : [];
  
  // If no makes available, prevent crashes with a friendly message
  if (safeMakes.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No makes available. Please try again later.
      </div>
    );
  }

  const safeMakeOptions = safeMakes.map((make) => ({
    value: make.make_name,
    label: make.make_name,
    icon: make.logo_url
  }));

  // Ensure models is always an array
  const safeModelOptions = Array.isArray(filteredModels) ? filteredModels.map((model) => ({
    value: model.model_name,
    label: model.model_name
  })) : [];

  return (
    <div className="space-y-4">
      {/* Only render Make ComboBox if safeMakeOptions available */}
      {safeMakeOptions.length > 0 ? (
        <ComboBox
          items={safeMakeOptions}
          value={selectedMake}
          onChange={(make) => {
            onMakeChange(make);
          }}
          placeholder="Select a make"
          emptyText="No makes found"
          disabled={disabled}
          className="w-full"
        />
      ) : (
        <Skeleton className="h-10 w-full" />
      )}

      {/* Only render Model ComboBox if selectedMake and safeModelOptions available */}
      {selectedMake && safeModelOptions.length > 0 ? (
        <ComboBox
          items={safeModelOptions}
          value={selectedModel}
          onChange={(model) => {
            onModelChange(model);
          }}
          placeholder="Select a model"
          emptyText="No models found"
          disabled={disabled}
          className="w-full"
        />
      ) : selectedMake ? (
        <Skeleton className="h-10 w-full" />
      ) : null}
    </div>
  );
}
