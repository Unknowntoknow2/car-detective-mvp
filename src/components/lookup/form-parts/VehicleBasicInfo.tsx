
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '../types/manualEntry';
import { useVehicleData } from '@/hooks/useVehicleData';
import MakeModelSelect from './MakeModelSelect';
import { useEffect } from 'react';
import { ValidationError } from '@/components/common/ValidationError';
import { useValidation } from '@/hooks/useValidation';
import { EnhancedManualEntrySchema } from '@/utils/validation/enhanced-validation';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleBasicInfoProps {
  form: UseFormReturn<ManualEntryFormData>;
  isDisabled?: boolean;
}

export function VehicleBasicInfo({ form, isDisabled = false }: VehicleBasicInfoProps) {
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990); // Get years from 1990 to current year + 1

  const validation = useValidation(EnhancedManualEntrySchema);

  useEffect(() => {
    console.log("VehicleBasicInfo form values:", form.getValues());
  }, [form.watch('make'), form.watch('model'), form.watch('year'), form.watch('mileage')]);

  const handleFieldValidation = (field: string, value: any) => {
    const result = validation.validateField(field, value);
    if (!result.isValid) {
      form.setError(field as any, {
        type: 'manual',
        message: result.error
      });
    } else {
      form.clearErrors(field as any);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <MakeModelSelect form={form} isDisabled={isDisabled} />

        {/* Year Dropdown */}
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
                  field.onChange(yearValue);
                  handleFieldValidation('year', yearValue);
                }}
                value={field.value?.toString() || ''}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>

                {/* Only render if yearOptions is ready and has items */}
                {Array.isArray(yearOptions) && yearOptions.length > 0 ? (
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                ) : (
                  <SelectContent>
                    <div className="p-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </SelectContent>
                )}
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Mileage and ZIP */}
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
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter ZIP code"
                  maxLength={10}
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
