
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validatePlate, validateZipCode } from '@/utils/validation';
import { usStates } from '@/data/states';
import { Loader2 } from 'lucide-react';

interface EnhancedPlateLookupProps {
  onSubmit: (data: {
    plate: string;
    state: string;
    zipCode: string;
  }) => void;
  isLoading?: boolean;
}

export function EnhancedPlateLookup({ onSubmit, isLoading = false }: EnhancedPlateLookupProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState<{
    plate?: string;
    state?: string;
    zipCode?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      plate?: string;
      state?: string;
      zipCode?: string;
    } = {};

    const plateError = validatePlate(plate);
    if (plateError) {
      newErrors.plate = plateError;
    }

    if (!state) {
      newErrors.state = 'State is required';
    }

    const zipError = validateZipCode(zipCode);
    if (zipError) {
      newErrors.zipCode = zipError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        plate,
        state,
        zipCode,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="plate" className="block text-sm font-medium">
              License Plate
            </label>
            <Input
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              className={errors.plate ? 'border-red-500' : ''}
              aria-invalid={!!errors.plate}
            />
            {errors.plate && <p className="text-sm text-red-500">{errors.plate}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium">
              State
            </label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger
                id="state"
                className={errors.state ? 'border-red-500' : ''}
                aria-invalid={!!errors.state}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="zipCode" className="block text-sm font-medium">
              ZIP Code
            </label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              className={errors.zipCode ? 'border-red-500' : ''}
              aria-invalid={!!errors.zipCode}
            />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Looking up...
              </>
            ) : (
              'Lookup License Plate'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EnhancedPlateLookup;
