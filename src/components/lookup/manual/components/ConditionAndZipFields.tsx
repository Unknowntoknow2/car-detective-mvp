
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
import { ConditionLevel } from "@/components/lookup/types/manualEntry";
import { ConditionSelectorSegmented } from "@/components/lookup/ConditionSelectorSegmented";

interface ConditionOption {
  value: string;
  label: string;
}

interface ConditionAndZipFieldsProps {
  form: UseFormReturn<any>;
  conditionOptions: ConditionOption[];
}

export const ConditionAndZipFields: React.FC<ConditionAndZipFieldsProps> = ({ 
  form, 
  conditionOptions 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Condition & Location</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <FormControl>
                <ConditionSelectorSegmented
                  value={field.value}
                  onChange={field.onChange}
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
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Providing accurate condition information and ZIP code helps us determine the most accurate valuation for your area.
        </p>
      </div>
    </div>
  );
};
