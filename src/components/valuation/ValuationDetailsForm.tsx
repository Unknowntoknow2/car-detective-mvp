import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrimSelector } from '@/components/lookup/form-parts/TrimSelector';
import ConditionSelectorBar, { ConditionLevel } from '@/components/common/ConditionSelectorBar';

const detailsFormSchema = z.object({
  mileage: z.string().min(1, "Mileage is required").regex(/^\d+$/, "Mileage must be a number"),
  condition: z.nativeEnum(ConditionLevel),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
  trim: z.string().optional(),
  drivingBehavior: z.string().optional(),
});

interface ValuationDetailsFormProps {
  vehicleInfo: DecodedVehicleInfo;
  onSubmit: (details: any) => void;
  isLoading?: boolean;
}

export const ValuationDetailsForm: React.FC<ValuationDetailsFormProps> = ({
  vehicleInfo,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedTrim, setSelectedTrim] = useState(vehicleInfo.trim || 'Standard');

  const form = useForm({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      mileage: '',
      condition: ConditionLevel.Good,
      zipCode: '',
      trim: vehicleInfo.trim || 'Standard',
      drivingBehavior: 'normal',
    },
  });

  const handleSubmit = (values: z.infer<typeof detailsFormSchema>) => {
    onSubmit({
      mileage: parseInt(values.mileage, 10),
      condition: values.condition,
      zipCode: values.zipCode,
      trim: selectedTrim, // Use the trim from our selector
      drivingBehavior: values.drivingBehavior,
    });
  };

  // Handle trim selection
  const handleTrimChange = (value: string) => {
    setSelectedTrim(value);
    form.setValue('trim', value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Valuation Details</CardTitle>
        <CardDescription>
          Provide additional details about your {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} to get an accurate valuation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 35000" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <ConditionSelectorBar
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Our new Trim Selector component */}
            <TrimSelector
              make={vehicleInfo.make}
              model={vehicleInfo.model}
              year={vehicleInfo.year}
              value={selectedTrim}
              onChange={handleTrimChange}
            />

            <FormField
              control={form.control}
              name="drivingBehavior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driving Behavior</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driving behavior" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cautious">Cautious</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
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
                    <Input placeholder="e.g. 90210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Get Valuation'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
