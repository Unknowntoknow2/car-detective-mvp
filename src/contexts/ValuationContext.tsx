import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProcessFreeValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  vin?: string;
  trim_id?: string;
}

export interface ProcessFreeValuationResult {
  valuationId: string;
  estimatedValue: number;
  confidenceScore: number;
}

interface ValuationContextType {
  isLoading: boolean;
  createValuation: (data: any) => Promise<any>;
  getValuationById: (id: string) => Promise<any>;
  updateValuation: (id: string, data: any) => Promise<any>;
  processFreeValuation: (
    input: ProcessFreeValuationInput
  ) => Promise<ProcessFreeValuationResult>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(
  undefined
);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const createValuation = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      console.log('🔥 createValuation() called');
      console.debug('💡 Valuation Input:', JSON.stringify(data, null, 2));

      const { data: result, error } = await supabase
        .from('valuation_results')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('❌ Valuation creation failed:', error);
        throw error;
      }

      if (result.vin) {
        console.log('✅ Valuation created with VIN:', result.vin, 'valuation_id:', result.id);
      } else {
        console.warn('⚠️ New valuation_results created without VIN — may break decoded vehicle linkage');
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
      console.log('🔄 Updating valuation:', id, 'with VIN:', data.vin);

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

      if (result.vin) {
        console.log('✅ Valuation updated with VIN:', result.vin);
      } else {
        console.warn('⚠️ Valuation updated without VIN');
      }

      return result;
    } catch (error) {
      console.error('❌ Error updating valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processFreeValuation = useCallback(
    async (input: ProcessFreeValuationInput): Promise<ProcessFreeValuationResult> => {
      throw new Error('processFreeValuation not yet re-injected — please restore full implementation.');
    },
    []
  );

  const value: ValuationContextType = {
    isLoading,
    createValuation,
    getValuationById,
    updateValuation,
    processFreeValuation,
  };

  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuation = (): ValuationContextType => {
  const context = useContext(ValuationContext);
  if (!context) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
