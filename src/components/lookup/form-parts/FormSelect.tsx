
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

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
    return null;
  }

  const { control, watch, setValue } = form;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={watch(name)}
            onValueChange={(value) => {
              setValue(name, value);
              onChange?.(value);
            }}
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
