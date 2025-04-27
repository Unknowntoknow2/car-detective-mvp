
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';
import { ErrorBoundary } from '../ErrorBoundary';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
  isDisabled?: boolean;
}

export function MakeModelSelect({ form, isDisabled = false }: MakeModelSelectProps) {
  const selectedMake = form.watch('make') || '';
  const selectedModel = form.watch('model') || '';

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
                  disabled={isDisabled}
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
