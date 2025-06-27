
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function ZipCodeInput({ 
  value,
  onChange,
  label = "ZIP Code", 
  required = false,
  className = ""
}: ZipCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
    onChange(newValue);
  };

  return (
    <div className={className}>
      <Label htmlFor="zip_code" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1">
        <Input
          id="zip_code"
          type="text"
          placeholder="Enter ZIP code"
          maxLength={5}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
