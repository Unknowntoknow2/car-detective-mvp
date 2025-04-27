
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { VehicleSelectorWithLogos } from './VehicleSelectorWithLogos';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const MakeModelSelect = ({ form }: MakeModelSelectProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make</FormLabel>
            <FormControl>
              <VehicleSelectorWithLogos
                selectedMake={field.value}
                onMakeChange={field.onChange}
                selectedModel={form.getValues().model}
                onModelChange={(model) => form.setValue('model', model)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
