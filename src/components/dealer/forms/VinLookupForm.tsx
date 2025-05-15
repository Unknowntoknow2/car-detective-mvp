
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

interface VinLookupFormProps {
  onSuccess: (data: Partial<DealerVehicleFormData>) => void;
  onCancel: () => void;
}

export const VinLookupForm: React.FC<VinLookupFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin.trim()) {
      setError('Please enter a VIN');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful VIN lookup result
      const mockData: Partial<DealerVehicleFormData> = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        transmission: 'Automatic',
        fuel_type: 'Gasoline',
        vin: vin,
      };
      
      onSuccess(mockData);
    } catch (err) {
      setError('Failed to lookup VIN. Please try again or enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLookup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="e.g. 1HGCM82633A123456"
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      
      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !vin.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up...
            </>
          ) : (
            'Look up VIN'
          )}
        </Button>
      </div>
    </form>
  );
};
