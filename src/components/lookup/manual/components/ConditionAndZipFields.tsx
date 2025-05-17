// src/components/lookup/manual/components/ConditionAndZipFields.tsx

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConditionLevel } from "@/components/lookup/types/manualEntry";
import { ConditionSelectorSegmented } from "@/components/lookup/ConditionSelectorSegmented";

interface ConditionAndZipFieldsProps {
  form: UseFormReturn<any>;
  conditionOptions?: Array<{ value: string; label: string }>;
}

export const ConditionAndZipFields: React.FC<ConditionAndZipFieldsProps> = ({
  form,
  conditionOptions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Vehicle Condition Selector (Segmented Bar) */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Vehicle Condition</FormLabel>
            <FormControl>
              <ConditionSelectorSegmented
                value={field.value as ConditionLevel}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ZIP Code Input */}
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>ZIP Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 90210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
