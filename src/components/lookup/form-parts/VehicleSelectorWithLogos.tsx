
import { useState, useEffect } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ComboBox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';
import { getModelsByMakeId } from '@/api/vehicleApi';

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
  const { makes, isLoading, error } = useVehicleData();
  const [modelOptions, setModelOptions] = useState<{ value: string, label: string }[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Effect to update model options when make changes
  useEffect(() => {
    console.log("VehicleSelectorWithLogos: Make changed to:", selectedMake);
    
    async function fetchModels() {
      if (selectedMake) {
        try {
          setLoadingModels(true);
          // Find the make by name first
          const selectedMakeObj = makes.find(make => make.make_name === selectedMake);
          
          if (selectedMakeObj) {
            console.log("VehicleSelectorWithLogos: Found make ID", selectedMakeObj.id);
            // Fetch models for this make ID
            const models = await getModelsByMakeId(selectedMakeObj.id);
            const mappedModels = models.map(model => ({
              value: model.model_name,
              label: model.model_name
            }));
            console.log(`VehicleSelectorWithLogos: Found ${mappedModels.length} models for make ${selectedMake}`);
            setModelOptions(mappedModels);
          } else {
            console.warn("VehicleSelectorWithLogos: Make not found for name", selectedMake);
            setModelOptions([]);
          }
        } catch (error) {
          console.error("Error fetching models:", error);
          setModelOptions([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        console.log("VehicleSelectorWithLogos: No make selected, clearing models");
        setModelOptions([]);
      }
    }
    
    fetchModels();
  }, [selectedMake, makes]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-700">Failed to load vehicle data. Please try again later.</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  // Ensure makes is properly mapped to ComboBox items
  const makesOptions = Array.isArray(makes) ? makes.map(make => ({
    value: make.make_name,
    label: make.make_name,
    icon: make.logo_url
  })) : [];
  
  console.log("VehicleSelectorWithLogos: Available makes count:", makesOptions.length);

  const handleMakeChange = (make: string) => {
    console.log("VehicleSelectorWithLogos: Make selection changed to:", make);
    onMakeChange(make);
    // Reset model when make changes
    onModelChange('');
  };

  const handleModelChange = (model: string) => {
    console.log("VehicleSelectorWithLogos: Model selection changed to:", model);
    onModelChange(model);
  };

  return (
    <div className="space-y-4">
      <ComboBox
        items={makesOptions}
        value={selectedMake}
        onChange={handleMakeChange}
        placeholder="Select a make"
        emptyText="No makes found"
        disabled={disabled}
        className="w-full"
      />
      
      <ComboBox
        items={modelOptions}
        value={selectedModel}
        onChange={handleModelChange}
        placeholder={selectedMake ? (loadingModels ? "Loading models..." : "Select a model") : "Select a make first"}
        emptyText="No models found"
        disabled={!selectedMake || disabled || loadingModels}
        className="w-full"
      />
    </div>
  );
}
