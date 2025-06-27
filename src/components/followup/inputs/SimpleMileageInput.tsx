
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimpleMileageInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export function SimpleMileageInput({ 
  value,
  onChange,
  label = "Current Mileage", 
  required = false,
  className = ""
}: SimpleMileageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    const numericValue = e.target.value.replace(/\D/g, '');
    const parsedValue = numericValue === '' ? 0 : parseInt(numericValue, 10);
    onChange(parsedValue);
  };

  const displayValue = value === 0 ? '' : value.toString();

  return (
    <div className={className}>
      <Label htmlFor="mileage" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1">
        <Input
          id="mileage"
          type="text"
          placeholder="Enter mileage"
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
