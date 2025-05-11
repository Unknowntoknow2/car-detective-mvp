
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function VinLookup({ 
  value = '', 
  onChange = () => {}, 
  onLookup = () => {}, 
  isLoading = false,
  standalone = true
}) {
  const [vin, setVin] = useState(value);
  const navigate = useNavigate();
  const { lookupVehicle, isLoading: isLookingUp, error, vehicle } = useVehicleLookup();
  
  const loading = isLoading || isLookingUp;

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    if (onChange) {
      onChange(newVin);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    try {
      // Lookup VIN using the hook
      const result = await lookupVehicle('vin', vin);
      
      if (onLookup) {
        // Call onLookup with no arguments
        onLookup();
      }
      
      // If this is a standalone component (not part of a larger form)
      // navigate to the results page
      if (standalone && result?.id) {
        localStorage.setItem('latest_valuation_id', result.id);
        navigate(`/result?id=${result.id}`);
      } else if (standalone && result) {
        toast.success('VIN lookup successful!');
      }
    } catch (err) {
      console.error('Error in VIN lookup:', err);
      toast.error('Failed to process VIN');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <Input
            value={vin}
            onChange={handleVinChange}
            placeholder="Enter 17-character VIN"
            className="font-mono"
            maxLength={17}
          />
          <Button type="submit" disabled={loading || vin.length !== 17}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              'Lookup'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}
