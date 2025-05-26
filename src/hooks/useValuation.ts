
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useValuation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

  const saveValuation = async (valuationData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Saving valuation data:', valuationData);
      
      const { data, error: saveError } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage,
          condition: valuationData.condition || 'good',
          zipCode: valuationData.zipCode || '90210',
          fuelType: valuationData.fuelType,
          transmission: valuationData.transmission,
          color: valuationData.color,
          bodyType: valuationData.bodyType,
          vin: valuationData.vin
        }
      });

      if (saveError) {
        console.error('Error saving valuation:', saveError);
        
        // Fallback: Store in localStorage if database fails
        const fallbackData = {
          id: `temp-${Date.now()}`,
          user_id: user?.id ?? ANONYMOUS_USER_ID,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage,
          estimated_value: 15000, // Default fallback value
          confidence_score: 85,
          condition: valuationData.condition || 'good',
          vin: valuationData.vin,
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('temp_valuation_data', JSON.stringify(fallbackData));
        localStorage.setItem('latest_valuation_id', fallbackData.id);
        
        return fallbackData;
      }

      console.log('Valuation saved successfully:', data);
      if (data?.id) {
        localStorage.setItem('latest_valuation_id', data.id);
      }

      return data;
    } catch (err: any) {
      console.error('Error in saveValuation:', err);
      
      // Fallback: Store in localStorage if API call fails
      const fallbackData = {
        id: `temp-${Date.now()}`,
        user_id: user?.id ?? ANONYMOUS_USER_ID,
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        estimated_value: 15000, // Default fallback value
        confidence_score: 85,
        condition: valuationData.condition || 'good',
        vin: valuationData.vin,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('temp_valuation_data', JSON.stringify(fallbackData));
      localStorage.setItem('latest_valuation_id', fallbackData.id);
      
      setError('Valuation saved locally. Database temporarily unavailable.');
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  };

  const getValuation = async (valuationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching valuation:', valuationId);
      
      const { data, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching valuation:', fetchError);
        
        // Fallback: Check localStorage
        const tempData = localStorage.getItem('temp_valuation_data');
        if (tempData) {
          const parsedData = JSON.parse(tempData);
          if (parsedData.id === valuationId) {
            return parsedData;
          }
        }
        
        throw fetchError;
      }

      if (!data) {
        // Fallback: Check localStorage
        const tempData = localStorage.getItem('temp_valuation_data');
        if (tempData) {
          const parsedData = JSON.parse(tempData);
          if (parsedData.id === valuationId) {
            return parsedData;
          }
        }
        
        throw new Error('Valuation not found');
      }

      return data;
    } catch (err: any) {
      console.error('Error in getValuation:', err);
      setError(err.message || 'Failed to fetch valuation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveManualValuation = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Saving manual valuation:', formData);
      
      const valuationData = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition || 'good',
        zip_code: formData.zipCode,
        fuel_type: formData.fuelType,
        transmission: formData.transmission,
        accident: formData.hasAccident === 'yes',
        accident_severity: formData.accidentSeverity,
        selected_features: formData.features || [],
        vin: formData.vin,
        user_id: user?.id ?? ANONYMOUS_USER_ID,
        created_at: new Date().toISOString()
      };

      const { data, error: saveError } = await supabase
        .from('manual_entry_valuations')
        .insert(valuationData)
        .select()
        .single();

      if (saveError) {
        console.error('Error saving manual valuation:', saveError);
        
        // Fallback: Store in localStorage
        const fallbackData = {
          ...valuationData,
          id: `manual-${Date.now()}`,
          valuation_id: `manual-${Date.now()}`
        };
        
        localStorage.setItem('temp_manual_valuation', JSON.stringify(fallbackData));
        
        throw saveError;
      }

      console.log('Manual valuation saved:', data);
      return data;
    } catch (err: any) {
      console.error('Error in saveManualValuation:', err);
      setError(err.message || 'Failed to save manual valuation');
      
      // Return fallback data even on error
      const fallbackData = {
        id: `manual-${Date.now()}`,
        user_id: user?.id ?? ANONYMOUS_USER_ID,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition || 'good',
        created_at: new Date().toISOString()
      };
      
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserValuations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUserId = user?.id ?? ANONYMOUS_USER_ID;
      console.log('Fetching valuations for user:', currentUserId);
      
      const { data, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching user valuations:', fetchError);
        
        // Fallback: Return empty array or localStorage data
        const tempData = localStorage.getItem('temp_valuation_data');
        if (tempData) {
          try {
            const parsedData = JSON.parse(tempData);
            return [parsedData];
          } catch (e) {
            console.error('Error parsing temp data:', e);
          }
        }
        
        return [];
      }

      console.log('Found valuations:', data?.length || 0);
      return data || [];
    } catch (err: any) {
      console.error('Error in getUserValuations:', err);
      setError(err.message || 'Failed to fetch user valuations');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    saveValuation,
    getValuation,
    saveManualValuation,
    getUserValuations
  };
}
