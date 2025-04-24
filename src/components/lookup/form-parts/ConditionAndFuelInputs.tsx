
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';

const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

interface ConditionAndFuelInputsProps {
  form: UseFormReturn<ManualEntryFormData>;
  conditionValue: string;
  setConditionValue: (value: string) => void;
}

export const ConditionAndFuelInputs = ({ form, conditionValue, setConditionValue }: ConditionAndFuelInputsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fuelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fuel Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setConditionValue(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.toLowerCase()} value={condition.toLowerCase()}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="mt-2">
              {conditionValue === 'excellent' && "Vehicle is like new with no visible issues"}
              {conditionValue === 'good' && "Vehicle is well maintained with minimal wear"}
              {conditionValue === 'fair' && "Vehicle has moderate wear and may need minor repairs"}
              {conditionValue === 'poor' && "Vehicle has significant wear and likely needs repairs"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
