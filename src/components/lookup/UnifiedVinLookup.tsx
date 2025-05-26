import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { toast } from 'sonner';

interface UnifiedVinLookupProps {
  onSubmit?: (vin: string) => void;
  showHeader?: boolean;
  className?: string;
}

export const UnifiedVinLookup: React.FC<UnifiedVinLookupProps> = ({
  onSubmit,
  showHeader = false,
  className
}) => {
  const navigate = useNavigate();
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { state, lookupVin } = useVinLookupFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('UNIFIED VIN LOOKUP: Form submitted with VIN:', vin);
    
    if (!vin.trim()) {
      setError('Please enter a VIN');
      return;
    }

    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error('Invalid VIN format');
      return;
    }

    setError(null);

    try {
      // If onSubmit is provided, use it (for embedded usage)
      if (onSubmit) {
        onSubmit(vin);
        return;
      }

      // Otherwise, use the VIN lookup flow and navigate
      console.log('UNIFIED VIN LOOKUP: Starting VIN lookup...');
      const result = await lookupVin(vin);
      
      if (result) {
        console.log('UNIFIED VIN LOOKUP: Success, navigating to valuation page');
        // Navigate to the valuation page with the VIN
        navigate(`/valuation/${vin}`);
      } else {
        console.log('UNIFIED VIN LOOKUP: No result returned');
        toast.error('Failed to lookup VIN');
      }
    } catch (error) {
      console.error('UNIFIED VIN LOOKUP: Error:', error);
      setError('Failed to lookup VIN');
      toast.error('Failed to lookup VIN');
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setError(null);
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Car's Value</h1>
          <p className="text-xl text-gray-600">Enter your VIN for an instant, accurate valuation</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>VIN Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="vin-input"
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={vin}
                onChange={handleVinChange}
                maxLength={17}
                className={error ? 'border-red-500' : ''}
                disabled={state.isLoading}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Find your VIN on your dashboard, driver's side door, or vehicle registration
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={state.isLoading || vin.length < 17}
              className="w-full"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up VIN...
                </>
              ) : (
                'Lookup Vehicle'
              )}
            </Button>
          </form>

          {state.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
