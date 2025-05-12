
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
}

export function VinDecoderForm({ onSubmit }: VinDecoderFormProps) {
  const [vin, setVin] = useState('');
  const { lookupVin, isLoading, error } = useVinDecoder();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }

    // If onSubmit prop is provided, use it
    if (onSubmit) {
      onSubmit(vin);
      return;
    }

    try {
      // Lookup VIN
      const result = await lookupVin(vin);
      
      if (!result) {
        toast.error('Unable to decode VIN');
        return;
      }
      
      try {
        // Create a valuation entry as an anonymous user
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
          .select('*')
          .single();
        
        if (insertError) {
          console.error('Error saving valuation:', insertError);
          
          // If there's an error with the DB insert, we still want to show results
          // Store minimal data in localStorage
          const tempValuationData = {
            id: crypto.randomUUID(),
            vin,
            make: result.make,
            model: result.model,
            year: result.year,
            estimated_value: Math.floor(Math.random() * (35000 - 15000) + 15000)
          };
          
          localStorage.setItem('latest_valuation_id', tempValuationData.id);
          localStorage.setItem('temp_valuation_data', JSON.stringify(tempValuationData));
          
          toast.success('VIN decoded successfully');
          navigate(`/result?valuationId=${tempValuationData.id}&temp=true`);
          return;
        }
        
        // Save the valuation ID to localStorage
        localStorage.setItem('latest_valuation_id', valuationData.id);
        
        // Navigate to the results page
        navigate(`/result?valuationId=${valuationData.id}`);
      } catch (dbError) {
        console.error('Database error:', dbError);
        toast.error('Error saving results, but VIN was decoded');
        
        // Fallback to showing results without saving to DB
        const tempValuationData = {
          id: crypto.randomUUID(),
          vin,
          make: result.make,
          model: result.model,
          year: result.year,
          estimated_value: Math.floor(Math.random() * (35000 - 15000) + 15000)
        };
        
        localStorage.setItem('temp_valuation_data', JSON.stringify(tempValuationData));
        navigate(`/result?valuationId=${tempValuationData.id}&temp=true`);
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
