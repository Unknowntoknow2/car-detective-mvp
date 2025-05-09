
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateVIN } from '@/utils/validation/vin-validation';

interface VinInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function VinInput({ value, onChange, placeholder = "Enter VIN", label }: VinInputProps) {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (value && value.length > 0) {
      if (value.length !== 17) {
        setError('VIN must be 17 characters');
      } else {
        // Basic validation
        const isValid = /^[A-HJ-NPR-Z0-9]{17}$/i.test(value);
        setError(isValid ? null : 'Invalid VIN format');
      }
    } else {
      setError(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase());
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor="vin">{label}</Label>}
      <Input
        id="vin"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`font-mono ${error ? 'border-red-300' : value.length === 17 ? 'border-green-300' : ''}`}
        maxLength={17}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
