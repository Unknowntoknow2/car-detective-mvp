
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function StandardVinLookupForm() {
  const [vin, setVin] = useState('');
  const [localError, setLocalError] = useState<string | null>(null); // Add a local error state
  const { lookupVin, isLoading, error } = useVinDecoder();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      setLocalError('Please enter a valid 17-character VIN');
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    setLocalError(null);

    try {
      // Lookup VIN
      const result = await lookupVin(vin);
      
      if (!result) {
        setLocalError('Unable to decode VIN');
        toast.error('Unable to decode VIN');
        return;
      }
      
      // Create a valuation entry
      const { data: valuationData, error: insertError } = await supabase
        .from('valuations')
        .insert({
          vin,
          make: result.make,
          model: result.model,
          year: result.year,
          mileage: 50000, // Default mileage
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user
          is_vin_lookup: true,
          condition_score: 70,
          estimated_value: Math.floor(Math.random() * (35000 - 15000) + 15000), // Mock value for demo
          confidence_score: 85
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error saving valuation:', insertError);
        setLocalError('Failed to save valuation data');
        toast.error('Failed to save valuation data');
        return;
      }
      
      // Save the valuation ID to localStorage
      localStorage.setItem('latest_valuation_id', valuationData.id);
      
      // Navigate to the results page
      navigate(`/result?valuationId=${valuationData.id}`);
      
    } catch (err) {
      console.error('Error in VIN lookup:', err);
      setLocalError('Failed to process VIN');
      toast.error('Failed to process VIN');
    }
  };

  // Display either the local error or the error from the hook
  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            className="font-mono"
            maxLength={17}
          />
          <Button type="submit" disabled={isLoading || vin.length !== 17}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              'Lookup'
            )}
          </Button>
        </div>
        {displayError && (
          <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{displayError}</span>
          </div>
        )}
      </div>
    </form>
  );
}
