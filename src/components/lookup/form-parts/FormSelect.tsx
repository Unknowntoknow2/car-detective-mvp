
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface FormSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  description?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  form,
  name,
  label,
  placeholder,
  options,
  description,
  disabled = false,
  onChange,
}) => {
  // Ensure form is provided before using FormField
  if (!form) {
    console.error('FormSelect requires a form prop to be passed');
    return null;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
