
import React, { useState, useEffect, useCallback } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';

interface BasicVehicleFormProps {
  form: any;
}

export const BasicVehicleForm: React.FC<BasicVehicleFormProps> = ({ form }) => {
  const { makes, models, isLoading, error, getModelsByMakeId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [loadingModels, setLoadingModels] = useState(false);

  // Watch form values
  const watchedMake = form.watch('make');
  const watchedModel = form.watch('model');

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  // Handle make selection and fetch models
  const handleMakeChange = useCallback(async (makeId: string) => {
    console.log('Make changed to:', makeId);
    setSelectedMakeId(makeId);
    form.setValue('make', makeId);
    form.setValue('model', ''); // Reset model when make changes

    if (makeId) {
      setLoadingModels(true);
      try {
        const fetchedModels = await getModelsByMakeId(makeId);
        console.log('Fetched models:', fetchedModels);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoadingModels(false);
      }
    }
  }, [form, getModelsByMakeId]);

  // Handle model selection
  const handleModelChange = useCallback((modelId: string) => {
    console.log('Model changed to:', modelId);
    form.setValue('model', modelId);
  }, [form]);

  // Sync form value with local state
  useEffect(() => {
    if (watchedMake && watchedMake !== selectedMakeId) {
      setSelectedMakeId(watchedMake);
    }
  }, [watchedMake, selectedMakeId]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p className="font-medium">Error loading vehicle data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <Select 
                onValueChange={handleMakeChange} 
                value={selectedMakeId}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {makes.map(make => (
                    <SelectItem key={make.id} value={make.id}>
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
                onValueChange={handleModelChange} 
                value={watchedModel}
                disabled={!selectedMakeId || loadingModels || models.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !selectedMakeId ? "Select make first" :
                      loadingModels ? "Loading models..." :
                      models.length === 0 ? "No models available" :
                      "Select model"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.model_name}
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
                  {yearOptions.map(year => (
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
        
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 45000" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
