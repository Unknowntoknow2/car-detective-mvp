
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';
import { useEffect, useState } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ErrorBoundary } from '../ErrorBoundary';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export function MakeModelSelect({ form }: MakeModelSelectProps) {
  const selectedMake = form.watch('make') || '';
  const selectedModel = form.watch('model') || '';
  const { getModelsByMake } = useVehicleData();
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  useEffect(() => {
    try {
      console.log("MakeModelSelect: Make changed to", selectedMake);
      
      if (selectedMake) {
        const models = getModelsByMake(selectedMake);
        const safeModels = Array.isArray(models) ? models : [];
        console.log(`MakeModelSelect: Found ${safeModels.length} models for ${selectedMake}`);
        setAvailableModels(safeModels);
        
        // Reset model if make changes and currently selected model isn't available
        if (selectedModel) {
          const modelExists = safeModels.some(model => model.model_name === selectedModel);
          if (!modelExists) {
            console.log("MakeModelSelect: Reset model due to make change");
            form.setValue('model', '');
          }
        }
      } else {
        console.log("MakeModelSelect: No make selected, clearing models");
        setAvailableModels([]);
        if (selectedModel) {
          form.setValue('model', '');
        }
      }
    } catch (error) {
      console.error("Error updating models in MakeModelSelect:", error);
      setAvailableModels([]);
      if (selectedModel) {
        form.setValue('model', '');
      }
    }
  }, [selectedMake, getModelsByMake, form, selectedModel]);

  return (
    <ErrorBoundary>
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
                    try {
                      console.log("MakeModelSelect: Setting make to:", make);
                      field.onChange(make);
                      form.setValue('model', '');
                    } catch (error) {
                      console.error("Error changing make:", error);
                    }
                  }}
                  selectedModel={selectedModel}
                  onModelChange={(model) => {
                    try {
                      console.log("MakeModelSelect: Setting model to:", model);
                      form.setValue('model', model);
                    } catch (error) {
                      console.error("Error changing model:", error);
                    }
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
    </ErrorBoundary>
  );
}
