
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';
import MakeModelSelect from '@/components/common/MakeModelSelect';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
  isDisabled?: boolean;
}

export function MakeModelSelect({ form, isDisabled = false }: MakeModelSelectProps) {
  // Fetch makes and models data using our new hook
  const { data, isLoading, isError, error } = useMakeModels();
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Make</p>
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Model</p>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to load vehicle data</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }
  
  const { makes, models } = data!;
  
  const selectedMakeId = form.watch('make') || '';
  const selectedModelId = form.watch('model') || '';
  
  const handleMakeChange = (makeId: string) => {
    form.setValue('make', makeId, { shouldValidate: true });
    // Reset model when make changes
    form.setValue('model', '', { shouldValidate: true });
  };
  
  const handleModelChange = (modelId: string) => {
    form.setValue('model', modelId, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <MakeModelSelect
                makes={makes}
                models={models}
                selectedMakeId={selectedMakeId}
                setSelectedMakeId={handleMakeChange}
                selectedModelId={selectedModelId}
                setSelectedModelId={handleModelChange}
                isDisabled={isDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
