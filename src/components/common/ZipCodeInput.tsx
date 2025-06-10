
import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  id?: string;
  name?: string;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  value,
  onChange,
  onBlur,
  className,
  error,
  disabled = false,
  required = false,
  placeholder = "Enter ZIP code",
  label = "ZIP Code",
  showLabel = true,
  id = "zipCode",
  name = "zipCode",
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\D/g, "").slice(0, 5);
    setLocalValue(sanitizedValue);
    onChange(sanitizedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const inputClasses = cn(
    "transition-all duration-200",
    error
      ? "border-red-300 focus:ring-red-200"
      : "focus:ring-primary/20 focus:border-primary hover:border-primary/30",
    isFocused && !error && "ring-2 ring-primary/20",
    className
  );

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClasses}
        disabled={disabled}
        required={required}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ZipCodeInput;
