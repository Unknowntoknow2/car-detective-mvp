
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';
import { ConditionValues } from './types';

export interface ConditionCategoryProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  ratings?: any[];
  selectedRating?: any | null;
  onSelect?: (rating: any) => void;
  // Add these new props
  name: string;
  label: string;
  form: UseFormReturn<any, any, undefined>;
}

export function ConditionCategory({ 
  title, 
  description,
  children,
  ratings,
  selectedRating,
  onSelect,
  // Use the new props
  name,
  label,
  form
}: ConditionCategoryProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <Label htmlFor={name} className="text-base font-medium">{label}</Label>
              <span className="text-sm font-medium">{field.value}</span>
            </div>
            <FormControl>
              <Slider
                id={name}
                min={0}
                max={100}
                step={1}
                value={[field.value]}
                onValueChange={(value) => field.onChange(value[0])}
              />
            </FormControl>
            <FormDescription className="text-xs">{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}
