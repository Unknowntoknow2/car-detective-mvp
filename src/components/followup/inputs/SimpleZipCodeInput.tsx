
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimpleZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function SimpleZipCodeInput({ 
  value,
  onChange,
  label = "ZIP Code", 
  required = false,
  className = ""
}: SimpleZipCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 5 characters
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(sanitized);
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
          placeholder="12345"
          maxLength={5}
          value={value}
          onChange={handleChange}
          className="font-mono"
        />
      </div>
    </div>
  );
}
