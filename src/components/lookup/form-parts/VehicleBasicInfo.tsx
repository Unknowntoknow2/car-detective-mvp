
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '../types/manualEntry';
import { useVehicleData } from '@/hooks/useVehicleData';
import { MakeModelSelect } from './MakeModelSelect';
import { useEffect } from 'react';

interface VehicleBasicInfoProps {
  form: UseFormReturn<ManualEntryFormData>;
  isDisabled?: boolean;
}

export function VehicleBasicInfo({ form, isDisabled = false }: VehicleBasicInfoProps) {
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1980);
  
  // Debug logging to trace state changes
  useEffect(() => {
    console.log("VehicleBasicInfo form values:", form.getValues());
  }, [form.watch('make'), form.watch('model'), form.watch('year'), form.watch('mileage')]);
  
  const fuelTypes = [
    { value: 'Gasoline', label: 'Gasoline' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Plugin_Hybrid', label: 'Plug-in Hybrid' },
    { value: 'Flex_Fuel', label: 'Flex Fuel' },
    { value: 'CNG', label: 'Compressed Natural Gas (CNG)' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <MakeModelSelect form={form} />
        
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year <span className="text-destructive">*</span></FormLabel>
              <Select
                disabled={isDisabled}
                onValueChange={(value) => {
                  const yearValue = parseInt(value, 10);
                  console.log("Setting year to:", yearValue);
                  field.onChange(yearValue);
                }}
                value={field.value?.toString() || ''}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 45000"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    console.log("Setting mileage to:", value);
                    field.onChange(value);
                  }}
                  min={0}
                  disabled={isDisabled}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select
                disabled={isDisabled}
                onValueChange={(value) => {
                  console.log("Setting fuel type to:", value);
                  field.onChange(value);
                }}
                value={field.value || ''}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter ZIP code"
                  maxLength={5}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    console.log("Setting ZIP code to:", value);
                    field.onChange(value.substring(0, 5));
                  }}
                  disabled={isDisabled}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
