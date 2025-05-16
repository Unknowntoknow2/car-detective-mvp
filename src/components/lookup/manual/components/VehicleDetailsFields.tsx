
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleDetailsFieldsProps {
  form: UseFormReturn<any>;
}

export const VehicleDetailsFields: React.FC<VehicleDetailsFieldsProps> = ({ form }) => {
  const fuelTypes = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Other'];
  const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="trim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trim (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. LE, XLE, Sport" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Red, Blue, Silver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "Gasoline"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fuelTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transmission</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "Automatic"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transmissionTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="bodyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body Type (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Sedan, SUV, Truck" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
