import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
=======
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ConditionValues } from "./types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface ConditionCategoryProps {
  title?: string;
  children?: React.ReactNode;
  ratings?: any[];
  selectedRating?: any | null;
  onSelect?: (rating: any) => void;
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

export function ConditionCategory({
  title,
  description,
  children,
  ratings,
  selectedRating,
  onSelect,
  name,
  label,
<<<<<<< HEAD
  value,
  onChange
}: ConditionCategoryProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <Label htmlFor={name} className="text-base font-medium">{label}</Label>
        <span className="text-sm font-medium">{value}</span>
      </div>
      
      <Slider
        id={name}
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
      />
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
=======
  form,
}: ConditionCategoryProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <Label htmlFor={name} className="text-base font-medium">
                {label}
              </Label>
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      )}
    </div>
  );
}
