
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ZipCodeInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ZipCodeInput({ value, onChange }: ZipCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (inputValue.length <= 5) {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="zipCode">Zip Code</Label>
      <Input
        id="zipCode"
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder="e.g., 90210"
        className="w-full"
        maxLength={5}
      />
      <p className="text-sm text-muted-foreground">
        Enter your 5-digit zip code for local market analysis
      </p>
    </div>
  );
}
