
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useState } from 'react';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const MakeModelSelect = ({ form }: MakeModelSelectProps) => {
  const [selectedMake, setSelectedMake] = useState<string>(form.getValues().make || '');
  const { makes, getModelsByMake, isLoading } = useVehicleData();

  const models = selectedMake ? getModelsByMake(selectedMake) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setSelectedMake(value);
                form.setValue('model', '');
              }}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem 
                    key={make.id} 
                    value={make.make_name}
                    className="flex items-center gap-2"
                  >
                    {make.logo_url && (
                      <img 
                        src={make.logo_url} 
                        alt={`${make.make_name} logo`} 
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    {make.make_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedMake || isLoading}
            >
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={selectedMake ? "Select Model" : "Select Make First"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
