
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useManualValuation, ManualVehicleInfo } from '@/hooks/useManualValuation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { carMakes, getModelsForMake } from '@/utils/carData';

const formSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.string().transform(val => parseInt(val, 10)),
  mileage: z.string().transform(val => parseInt(val, 10)),
  fuelType: z.string().min(1, { message: 'Fuel type is required' }),
  condition: z.string().min(1, { message: 'Condition is required' }),
  zipCode: z.string().optional(),
});

const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

export const ManualEntryForm = ({ 
  onSubmitSuccess 
}: { 
  onSubmitSuccess: (data: ManualVehicleInfo) => void
}) => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [conditionValue, setConditionValue] = useState<string>('good');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const vehicleData: Omit<ManualVehicleInfo, 'valuation' | 'confidenceScore'> = {
      make: values.make,
      model: values.model,
      year: values.year,
      mileage: values.mileage,
      fuelType: values.fuelType,
      condition: values.condition,
      zipCode: values.zipCode,
    };

    onSubmitSuccess(vehicleData as ManualVehicleInfo);
  };

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
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
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 50000"
                      {...field}
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
