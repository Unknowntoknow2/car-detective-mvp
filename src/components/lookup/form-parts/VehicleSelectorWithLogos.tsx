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

  const safeMakes = Array.isArray(makes) ? makes : [];
  const safeModels = Array.isArray(filteredModels) ? filteredModels : [];

  const safeMakeOptions = safeMakes.map((make) => ({
    value: make.make_name || '',
    label: make.make_name || '',
    icon: make.logo_url || undefined,
  }));

  const safeModelOptions = safeModels.map((model) => ({
    value: model.model_name || '',
    label: model.model_name || '',
  }));

  return (
    <div className="space-y-4">
      <ComboBox
        items={safeMakeOptions}
        value={selectedMake}
        onChange={(make) => {
          onMakeChange(make);
          onModelChange(''); // Clear model when make changes
        }}
        placeholder="Select a make"
        emptyText="No makes found"
        disabled={disabled}
        className="w-full"
      />

      {/* Only show model select if a make is selected */}
      {selectedMake && (
        <ComboBox
          items={safeModelOptions}
          value={selectedModel}
          onChange={(model) => {
            onModelChange(model);
          }}
          placeholder="Select a model"
          emptyText="No models found"
          disabled={!selectedMake || disabled}
          className="w-full"
        />
      )}
    </div>
  );
}
