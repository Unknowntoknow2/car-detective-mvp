
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';
import { useEffect } from 'react';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export function MakeModelSelect({ form }: MakeModelSelectProps) {
  const selectedMake = form.watch('make') || '';
  const selectedModel = form.watch('model') || '';

  // Reset model when make changes
  useEffect(() => {
    if (selectedMake && selectedModel) {
      // Only if we have a model value and the make changes, reset the model
      const models = form.getValues('models') || [];
      const makeModels = Array.isArray(models) ? models : [];
      const modelExists = makeModels.some(model => model === selectedModel);
      
      if (!modelExists) {
        form.setValue('model', '');
        console.log("Reset model due to make change");
      }
    }
  }, [selectedMake, selectedModel, form]);

  useEffect(() => {
    console.log("MakeModelSelect current values:", { 
      make: selectedMake, 
      model: selectedModel 
    });
  }, [selectedMake, selectedModel]);

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
                selectedModel={form.getValues('model') || ''}
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
