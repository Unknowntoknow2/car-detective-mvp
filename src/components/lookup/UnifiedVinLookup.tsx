
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UnifiedVinLookupProps {
  onSubmit?: (vin: string) => void;
  isLoading?: boolean;
  tier?: 'free' | 'premium';
}

export const UnifiedVinLookup: React.FC<UnifiedVinLookupProps> = ({ 
  onSubmit, 
  isLoading = false,
  tier = 'free'
}) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateVin = (value: string): boolean => {
    const cleanVin = value.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    return cleanVin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVin(vin)) {
      setError('Please enter a valid 17-character VIN');
      return;
    }
    
    setError(null);
    
    if (onSubmit) {
      onSubmit(vin);
    } else {
      navigate(`/valuation/${vin}`);
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    if (error && validateVin(value)) {
      setError(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup {tier === 'premium' && '(Premium)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              type="text"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-digit VIN"
              maxLength={17}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-gray-500 text-sm mt-1">
              The VIN is usually found on your dashboard, driver's side door, or registration.
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={!vin || vin.length < 17 || isLoading}
            className="w-full"
          >
            {isLoading ? 'Looking up...' : 'Look up Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnifiedVinLookup;
