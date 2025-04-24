
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MakeModelSelect } from './form-parts/MakeModelSelect';
import { VehicleDetailsInputs } from './form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from './form-parts/ConditionAndFuelInputs';
import { manualEntryFormSchema, ManualEntryFormData } from './types/manualEntry';

interface ManualEntryFormProps {
  onSubmitSuccess: (data: ManualEntryFormData) => void;
}

export const ManualEntryForm = ({ onSubmitSuccess }: ManualEntryFormProps) => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [conditionValue, setConditionValue] = useState<string>('good');
  
  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntryFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '2020',
      mileage: '50000',
      fuelType: 'Gasoline',
      condition: 'good',
      zipCode: '',
    },
  });

  // Generate years from 1980 to current year
  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const years = generateYears();

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Enter Your Vehicle Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitSuccess)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MakeModelSelect 
              form={form} 
              selectedMake={selectedMake} 
              setSelectedMake={setSelectedMake} 
            />

            <VehicleDetailsInputs form={form} years={years} />

            <ConditionAndFuelInputs 
              form={form} 
              conditionValue={conditionValue} 
              setConditionValue={setConditionValue} 
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 90210"
                      {...field}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Helps us provide a more accurate valuation for your area
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">Get Valuation</Button>
        </form>
      </Form>
    </Card>
  );
};
