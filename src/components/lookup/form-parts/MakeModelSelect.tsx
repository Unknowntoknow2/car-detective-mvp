
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';
import { useEffect, useState } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export function MakeModelSelect({ form }: MakeModelSelectProps) {
  const selectedMake = form.watch('make') || '';
  const selectedModel = form.watch('model') || '';
  const { getModelsByMake } = useVehicleData();
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // When make changes, update available models and reset model if needed
  useEffect(() => {
    if (selectedMake) {
      try {
        const models = getModelsByMake(selectedMake);
        const safeModels = Array.isArray(models) ? models : [];
        setAvailableModels(safeModels);
        
        // Reset model if make changes and currently selected model isn't available for the new make
        if (selectedModel) {
          const modelExists = safeModels.some(model => model.model_name === selectedModel);
          if (!modelExists) {
            form.setValue('model', '');
            console.log("Reset model due to make change");
          }
        }
      } catch (error) {
        console.error("Error getting models for make:", error);
        setAvailableModels([]);
      }
    } else {
      setAvailableModels([]);
    }
  }, [selectedMake, getModelsByMake, form, selectedModel]);

  useEffect(() => {
    console.log("MakeModelSelect current values:", { 
      make: selectedMake, 
      model: selectedModel,
      availableModelsCount: availableModels ? availableModels.length : 0 
    });
  }, [selectedMake, selectedModel, availableModels]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <VehicleSelectorWithLogos
                selectedMake={field.value || ''}
                onMakeChange={(make) => {
                  console.log("Setting make to:", make);
                  field.onChange(make);
                  form.setValue('model', ''); // Reset model when make changes
                }}
                selectedModel={selectedModel}
                onModelChange={(model) => {
                  console.log("Setting model to:", model);
                  form.setValue('model', model);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model <span className="text-destructive">*</span></FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
