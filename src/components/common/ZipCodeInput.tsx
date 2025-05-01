
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { validateZipCode, debounce, ZipValidationResult } from '@/utils/validation/zipCodeValidator';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string, isValid?: boolean) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showValidation?: boolean;
  label?: React.ReactNode;
  name?: string;
  id?: string;
  autoFocus?: boolean;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  value,
  onChange,
  className,
  placeholder = 'Enter ZIP code',
  disabled = false,
  required = false,
  showValidation = true,
  label,
  name = 'zipCode',
  id = 'zipCode',
  autoFocus = false
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ZipValidationResult | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define the debounced validation function
  const debouncedValidate = useRef(
    debounce(async (zipToValidate: string) => {
      if (!zipToValidate || zipToValidate.length !== 5) {
        setValidation(null);
        return;
      }
      
      setIsValidating(true);
      const result = await validateZipCode(zipToValidate);
      setValidation(result);
      setIsValidating(false);
      
      // Notify parent component about validation result
      onChange(zipToValidate, result.isValid);
    }, 300)
  ).current;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 5 characters
    const sanitizedValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    
    // Update parent component with the new value
    onChange(sanitizedValue);
    
    // Validate if 5 digits entered
    if (sanitizedValue.length === 5) {
      debouncedValidate(sanitizedValue);
    } else if (validation) {
      // Clear validation if ZIP is no longer 5 digits
      setValidation(null);
    }
  };

  // Validate on blur if value is 5 digits
  const handleBlur = () => {
    setTouched(true);
    if (value && value.length === 5) {
      debouncedValidate(value);
    }
  };

  // Validate initial value if provided
  useEffect(() => {
    if (value && value.length === 5 && touched) {
      debouncedValidate(value);
    }
  }, [value, touched, debouncedValidate]);

  // If autofocus is enabled, focus the input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Determine validation status UI elements
  const getValidationIcon = () => {
    if (!showValidation || !touched || value.length !== 5) return null;
    
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    
    if (validation) {
      return validation.isValid ? 
        <CheckCircle className="h-4 w-4 text-success" /> : 
        <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10",
            validation && !validation.isValid && touched ? "border-destructive focus:border-destructive" : "",
            validation?.isValid && touched ? "border-success focus:border-success" : "",
            className
          )}
          maxLength={5}
          inputMode="numeric"
          pattern="[0-9]*"
          required={required}
        />
        
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      
      {/* Validation message */}
      {touched && validation && !validation.isValid && value.length === 5 && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Invalid ZIP code
        </p>
      )}
      
      {/* City/State display when valid */}
      {validation?.isValid && (
        <p className="text-xs text-muted-foreground">
          {validation.city}, {validation.state}
        </p>
      )}
    </div>
  );
};
