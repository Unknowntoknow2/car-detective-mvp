
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value) || 0;
    onChange(numValue);
  };

  return (
    <div className={className}>
      <Label htmlFor="mileage" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1">
        <Input
          id="mileage"
          type="number"
          placeholder="Enter mileage"
          value={value || ''}
          onChange={handleChange}
          required={required}
        />
      </div>
    </div>
  );
}
