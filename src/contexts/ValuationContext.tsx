
import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ValuationContextType {
  isLoading: boolean;
  createValuation: (data: any) => Promise<any>;
  getValuationById: (id: string) => Promise<any>;
  updateValuation: (id: string, data: any) => Promise<any>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createValuation = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      console.log('🔄 Creating new valuation record...');
      
      const { data: result, error } = await supabase
        .from('valuation_results')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('❌ Valuation creation failed:', error);
        throw error;
      }

      // Log VIN storage status during creation
      if (result.vin) {
        console.log('✅ Valuation created with VIN:', result.vin, 'valuation_id:', result.id);
      } else {
        console.warn('⚠️ New valuation_results created without VIN — may break decoded vehicle linkage');
        console.log('📋 Valuation created:', result.id, 'VIN: missing');
      }

      return result;
    } catch (error) {
      console.error('❌ Error creating valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getValuationById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('valuation_results')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching valuation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ Error in getValuationById:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateValuation = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('🔄 Updating valuation:', id);
      
      const { data: result, error } = await supabase
        .from('valuation_results')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Valuation update failed:', error);
        throw error;
      }

      // Log VIN status during update
      if (result.vin) {
        console.log('✅ Valuation updated with VIN:', result.vin, 'valuation_id:', result.id);
      } else {
        console.warn('⚠️ Valuation updated without VIN — may break decoded vehicle linkage');
      }

      return result;
    } catch (error) {
      console.error('❌ Error updating valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isLoading,
    createValuation,
    getValuationById,
    updateValuation
  };

  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
