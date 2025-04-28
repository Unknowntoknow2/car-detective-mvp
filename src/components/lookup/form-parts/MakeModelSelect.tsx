
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';
import { ErrorBoundary } from '../ErrorBoundary';
import { useEffect } from 'react';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
  isDisabled?: boolean;
}

export function MakeModelSelect({ form, isDisabled = false }: MakeModelSelectProps) {
  const selectedMake = form.watch('make') || '';
  const selectedModel = form.watch('model') || '';

  // Debug log when form values change
  useEffect(() => {
    console.log("MakeModelSelect: form values updated:", {
      make: selectedMake,
      model: selectedModel
    });
  }, [selectedMake, selectedModel]);

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
                    console.log("MakeModelSelect: Setting make in form to:", make);
                    field.onChange(make);
                    form.setValue('model', ''); // reset model when make changes
                    form.trigger('make'); // validate the field
                  }}
                  selectedModel={selectedModel}
                  onModelChange={(model) => {
                    console.log("MakeModelSelect: Setting model in form to:", model);
                    form.setValue('model', model);
                    form.trigger('model'); // validate the field
                  }}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ErrorBoundary>
  );
}
