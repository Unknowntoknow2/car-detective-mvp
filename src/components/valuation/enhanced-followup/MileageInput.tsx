
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MileageInputProps {
  value?: number;
  onChange: (value: number) => void;
}

export function MileageInput({ value, onChange }: MileageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, '');
    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const formatValue = (val?: number) => {
    if (!val) return '';
    return val.toLocaleString();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="mileage">Current Mileage</Label>
      <Input
        id="mileage"
        type="text"
        value={formatValue(value)}
        onChange={handleChange}
        placeholder="e.g., 45,000"
        className="w-full"
      />
      <p className="text-sm text-muted-foreground">
        Enter the current odometer reading
      </p>
    </div>
  );
}
