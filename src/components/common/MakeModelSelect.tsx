
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { VehicleMake, VehicleModel } from '@/hooks/useMakeModels';

interface MakeModelSelectProps {
  makes: VehicleMake[];
  models: VehicleModel[];
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isLoadingModels?: boolean;
  error?: string | null;
}

const MakeModelSelect: React.FC<MakeModelSelectProps> = ({
  makes,
  models,
  selectedMakeId,
  setSelectedMakeId,
  selectedModelId,
  setSelectedModelId,
  isDisabled = false,
  isLoading = false,
  isLoadingModels = false,
  error = null
}) => {
  console.log('MakeModelSelect render:', { 
    selectedMakeId, 
    selectedModelId,
    makesCount: makes.length,
    modelsCount: models.length,
    isLoadingModels
  });
  
  // Filter models based on selected make
  const filteredModels = models.filter(model => model.make_id === selectedMakeId);
  console.log('Filtered models:', filteredModels, 'makeId:', selectedMakeId);

  // Reset model selection when make changes
  useEffect(() => {
    if (selectedMakeId && selectedModelId) {
      const modelExists = filteredModels.some(model => model.id === selectedModelId);
      if (!modelExists) {
        console.log('Resetting model selection because selected model is not in filtered list');
        setSelectedModelId('');
      }
    }
  }, [selectedMakeId, filteredModels, selectedModelId, setSelectedModelId]);

  const handleMakeChange = (newMakeId: string) => {
    console.log('Make changed to:', newMakeId);
    setSelectedMakeId(newMakeId);
    // Always reset model selection when make changes
    setSelectedModelId('');
  };

  const handleModelChange = (newModelId: string) => {
    console.log('Model changed to:', newModelId);
    setSelectedModelId(newModelId);
  };

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <Skeleton className="h-10 w-full rounded" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <Skeleton className="h-10 w-full rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex space-x-4">
      {/* Make Dropdown */}
      <div className="flex-1">
        <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">Make</label>
        <Select
          value={selectedMakeId}
          onValueChange={handleMakeChange}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map(make => (
              <SelectItem key={make.id} value={make.id}>
                {make.make_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Model Dropdown */}
      <div className="flex-1">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
        <Select
          value={selectedModelId}
          onValueChange={handleModelChange}
          disabled={isDisabled || !selectedMakeId || isLoadingModels}
        >
          <SelectTrigger className="w-full">
            <SelectValue 
              placeholder={
                !selectedMakeId 
                  ? "Select Make First" 
                  : isLoadingModels
                    ? "Loading..."
                    : filteredModels.length === 0
                      ? "No models available"
                      : "Select Model"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {filteredModels.map(model => (
              <SelectItem key={model.id} value={model.id}>
                {model.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoadingModels && (
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Loading models...
          </div>
        )}
        
        {selectedMakeId && !isLoadingModels && filteredModels.length === 0 && (
          <div className="mt-1 text-sm text-orange-600">
            No models found for selected make
          </div>
        )}
      </div>
    </div>
  );
};

// Named export for backward compatibility
export { MakeModelSelect };
export default MakeModelSelect;
