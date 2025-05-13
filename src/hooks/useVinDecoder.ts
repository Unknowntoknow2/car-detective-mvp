
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { DecodedVehicleInfo } from '@/types/vehicle';

export function useVinDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodedVehicleInfo | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);

  const lookupVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get from cached results
      const { data: cachedData } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .single();
      
      if (cachedData) {
        console.log('Found cached VIN data:', cachedData);
        setResult(cachedData);
        
        // Create a valuation record for this lookup
        const valuationId = crypto.randomUUID();
        
        // Get user if logged in, otherwise use null
        const { data } = await supabase.auth.getUser();
        const userId = data.user?.id;
        
        // Store valuation result
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .insert({
            id: valuationId,
            user_id: userId,
            vin: vin,
            make: cachedData.make,
            model: cachedData.model,
            year: cachedData.year,
            is_vin_lookup: true,
            // Set default values
            mileage: 50000,
            condition: 'good',
            estimated_value: 15000, // This is a placeholder - would normally come from a pricing algorithm
            confidence_score: 70,
            base_price: 15000,
          })
          .select()
          .single();
        
        if (valuationError) {
          console.error('Error creating valuation record:', valuationError);
        } else {
          console.log('Created valuation record:', valuationData);
          setValuationId(valuationId);
          localStorage.setItem('latest_valuation_id', valuationId);
        }
        
        return cachedData;
      }
      
      // If not cached, call the unified decode edge function
      const response = await fetch(
        'https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/unified-decode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'vin',
            vin: vin,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || data.error);
      }
      
      if (!data.decoded) {
        throw new Error('No data returned from VIN decoder');
      }
      
      // If there's an error in the decoded data
      if (data.decoded.error) {
        throw new Error(data.decoded.error);
      }
      
      const decodedData: DecodedVehicleInfo = {
        vin: vin,
        ...data.decoded
      };
      
      console.log('Decoded VIN data:', decodedData);
      setResult(decodedData);
      
      // Create a valuation record for this lookup
      const valuationId = crypto.randomUUID();
      
      // Get user if logged in, otherwise use null
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data.user?.id;
      
      // Store valuation result
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          id: valuationId,
          user_id: userId,
          vin: vin,
          make: decodedData.make,
          model: decodedData.model,
          year: decodedData.year,
          is_vin_lookup: true,
          // Set default values
          mileage: 50000,
          condition: 'good',
          estimated_value: 15000, // This is a placeholder - would normally come from a pricing algorithm
          confidence_score: 70,
          base_price: 15000,
        })
        .select()
        .single();
      
      if (valuationError) {
        console.error('Error creating valuation record:', valuationError);
      } else {
        console.log('Created valuation record:', valuationData);
        setValuationId(valuationId);
        localStorage.setItem('latest_valuation_id', valuationId);
      }
      
      return decodedData;
    } catch (err: any) {
      console.error('Error in VIN lookup:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupVin,
    isLoading,
    error,
    result,
    valuationId
  };
}
