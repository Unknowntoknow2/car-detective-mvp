
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface MileageInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function MileageInput({ 
  value, 
  onChange, 
  label = "Current Mileage", 
  required = false,
  className = ""
}: MileageInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value > 0) {
      setDisplayValue(isFocused ? value.toString() : value.toLocaleString());
    } else {
      setDisplayValue('');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    if (value > 0) {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value > 0) {
      setDisplayValue(value.toLocaleString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    setDisplayValue(numericValue);
    
    if (numericValue === '') {
      setError('');
      onChange(0);
      return;
    }

    const mileage = parseInt(numericValue);
    
    if (mileage < 0) {
      setError('Mileage cannot be negative');
      return;
    }
    
    if (mileage > 999999) {
      setError('Mileage seems too high (max: 999,999)');
      return;
    }
    
    setError('');
    onChange(mileage);
  };

  const isValid = value > 0 && value <= 999999 && !error;

  return (
    <div className={className}>
      <Label htmlFor="mileage" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative mt-1">
        <Input
          id="mileage"
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter mileage"
          className={`pr-10 ${
            error ? 'border-red-500 focus:border-red-500' : 
            isValid ? 'border-green-500 focus:border-green-500' : 
            'border-gray-300'
          }`}
          required={required}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
        {isValid && !error && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {isValid && !error && (
        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {value.toLocaleString()} miles
        </p>
      )}
    </div>
  );
}
