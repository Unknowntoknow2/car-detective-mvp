
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { carMakes, getModelsForMake } from '@/utils/carData';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { useState } from 'react';

interface MakeModelSelectProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const MakeModelSelect = ({ form }: MakeModelSelectProps) => {
  const [selectedMake, setSelectedMake] = useState<string>(form.getValues().make || '');

  return (
    <>
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
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {carMakes.sort().map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
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
              defaultValue={field.value}
              disabled={!selectedMake}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={selectedMake ? "Select model" : "Select make first"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectedMake && getModelsForMake(selectedMake).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
