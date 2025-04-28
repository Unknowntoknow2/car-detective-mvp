
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

  const handleMakeChange = (make: string) => {
    console.log("MakeModelSelect: Setting make in form to:", make);
    // Only update if value actually changed
    if (make !== selectedMake) {
      form.setValue('make', make, { shouldValidate: true });
      // Reset model when make changes
      form.setValue('model', '', { shouldValidate: true });
    }
  };

  const handleModelChange = (model: string) => {
    console.log("MakeModelSelect: Setting model in form to:", model);
    // Only update if value actually changed
    if (model !== selectedModel) {
      form.setValue('model', model, { shouldValidate: true });
    }
  };

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
                  onMakeChange={handleMakeChange}
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
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
