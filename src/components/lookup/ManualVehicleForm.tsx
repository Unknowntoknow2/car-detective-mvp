
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from './types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';
import MakeModelSelect from '@/components/common/MakeModelSelect';

interface ManualVehicleFormProps {
  form: UseFormReturn<ManualEntryFormData>;
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
}

export function ManualVehicleForm({ form, onSubmit, isLoading = false }: ManualVehicleFormProps) {
  const { makes, models, isLoading: makesLoading, error, fetchModelsByMakeId } = useMakeModels();

  // Watch for make changes and fetch models
  const selectedMakeId = form.watch('make');
  const selectedModelId = form.watch('model');

  useEffect(() => {
    if (selectedMakeId && makes.length > 0) {
      console.log('🔄 Fetching models for make:', selectedMakeId);
      fetchModelsByMakeId(selectedMakeId);
    }
  }, [selectedMakeId, makes.length, fetchModelsByMakeId]);

  const handleMakeChange = async (makeId: string) => {
    console.log('🎯 Make changed to:', makeId);
    form.setValue('make', makeId, { shouldValidate: true });
    // Reset model when make changes
    form.setValue('model', '', { shouldValidate: true });
    
    // Fetch models for the new make
    if (makeId) {
      await fetchModelsByMakeId(makeId);
    }
  };

  const handleModelChange = (modelId: string) => {
    console.log('🎯 Model changed to:', modelId);
    form.setValue('model', modelId, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Make and Model Selection */}
          <div className="space-y-4">
            <MakeModelSelect
              makes={makes}
              models={models}
              selectedMakeId={selectedMakeId}
              setSelectedMakeId={handleMakeChange}
              selectedModelId={selectedModelId}
              setSelectedModelId={handleModelChange}
              isLoading={makesLoading}
              error={error}
              isDisabled={isLoading}
            />
          </div>
          
          {/* Year */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mileage */}
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter mileage"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Condition */}
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ZIP Code */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter ZIP code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Getting Valuation...' : 'Get Valuation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ManualVehicleForm;
