
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

interface BasicVehicleFormProps {
  form: any;
}

export const BasicVehicleForm: React.FC<BasicVehicleFormProps> = ({ form }) => {
  const { makes, models, isLoading, getModelsByMake } = useMakeModels();
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const watchedMake = form.watch('make');

  useEffect(() => {
    if (watchedMake && watchedMake !== selectedMake) {
      setSelectedMake(watchedMake);
      setIsLoadingModels(true);
      
      getModelsByMake(watchedMake).finally(() => {
        setIsLoadingModels(false);
      });
    }
  }, [watchedMake, selectedMake, getModelsByMake]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {makes.map((make) => (
                    <SelectItem key={make.id} value={make.make_name}>
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
                disabled={!selectedMake || isLoadingModels}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingModels ? "Loading..." : 
                      !selectedMake ? "Select make first" : 
                      "Select model"
                    } />
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

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 2020" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
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
                  placeholder="e.g. 90210" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(value as ConditionLevel)} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
                <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
                <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
                <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
                <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicVehicleForm;
