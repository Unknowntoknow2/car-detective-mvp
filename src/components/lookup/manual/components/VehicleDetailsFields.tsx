<<<<<<< HEAD

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
=======
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VehicleDetailsFieldsProps {
  form: any;
}

<<<<<<< HEAD
export const VehicleDetailsFields: React.FC<VehicleDetailsFieldsProps> = ({ form }) => {
  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
    { value: 'dual_clutch', label: 'Dual Clutch' },
    { value: 'sequential', label: 'Sequential' }
  ];
  
  const fuelTypeOptions = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'alternative', label: 'Alternative' }
  ];
  
  const bodyTypeOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'convertible', label: 'Convertible' },
    { value: 'wagon', label: 'Wagon' },
    { value: 'van', label: 'Van/Minivan' }
  ];
  
=======
export const VehicleDetailsFields: React.FC<VehicleDetailsFieldsProps> = (
  { form },
) => {
  const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Other"];
  const transmissionTypes = ["Automatic", "Manual", "CVT", "Semi-Automatic"];

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transmission</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || transmissionOptions[0].value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transmissionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || fuelTypeOptions[0].value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fuelTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          name="bodyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || bodyTypeOptions[0].value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bodyTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
                <Input placeholder="e.g. Red, Silver, Blue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
<<<<<<< HEAD
    </div>
=======
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
                  {fuelTypes.map((type) => (
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
                  {transmissionTypes.map((type) => (
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};
