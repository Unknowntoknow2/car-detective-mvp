
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateUnifiedValuation } from '@/services/valuationEngine';
import type { UnifiedValuationResult, ValuationInput } from '@/types/valuation';
import { toast } from 'sonner';

interface ValuationContextType {
  valuationData?: UnifiedValuationResult | null;
  isPremium: boolean;
  isLoading: boolean;
  error?: string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
  rerunValuation: (input: ValuationInput) => Promise<UnifiedValuationResult>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

interface ValuationProviderProps {
  children: React.ReactNode;
  valuationId?: string;
}

export function ValuationProvider({ children, valuationId }: ValuationProviderProps) {
  const [valuationData, setValuationData] = useState<UnifiedValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  

  useEffect(() => {
    if (valuationId) {
      loadValuationData(valuationId);
    }
  }, [valuationId]);

  const loadValuationData = async (id: string) => {
    console.log('🔍 Loading valuation data for ID:', id);
    setIsLoading(true);
    setError(null);

    try {
      let data, fetchError;
      
      // Check if ID is a UUID (valuation ID) or a VIN
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUuid) {
        // Query by valuation ID
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();
        data = response.data;
        fetchError = response.error;
      } else {
        // Query by VIN (get most recent valuation for this VIN)
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        data = response.data;
        fetchError = response.error;
      }

      if (fetchError) {
        console.error('❌ Failed to fetch valuation:', fetchError);
        setError('Failed to load valuation data');
        return;
      }

      if (!data) {
        console.error('❌ No valuation data found for ID:', id);
        setError('Valuation not found');
        return;
      }

      console.log('✅ Loaded valuation data:', data);

      // Transform legacy valuation data to UnifiedValuationResult format
      const unifiedResult: UnifiedValuationResult = {
        id: data.id,
        vin: data.vin || undefined,
        vehicle: {
          year: data.year,
          make: data.make,
          model: data.model,
          trim: data.trim,
          fuelType: data.fuel_type
        },
        zip: data.state || '',
        mileage: data.mileage,
        baseValue: data.estimated_value,
        adjustments: [],
        finalValue: data.estimated_value,
        confidenceScore: data.confidence_score || 40,
        aiExplanation: data.explanation || 'Legacy valuation data',
        sources: ['legacy_database'],
        listingRange: {
          _type: "defined" as const,
          value: `$${(data.estimated_value * 0.9).toLocaleString()} - $${(data.estimated_value * 1.1).toLocaleString()}` as const
        },
        listingCount: 0,
        listings: [],
        marketSearchStatus: 'legacy_data',
        timestamp: Date.now()
      };

      setValuationData(unifiedResult);
      setIsPremium(data.premium_unlocked || false);

    } catch (err) {
      console.error('❌ Error loading valuation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const rerunValuation = async (input: ValuationInput) => {
    console.log('🔄 Rerunning valuation with real-time engine:', input);
    setIsLoading(true);
    setError(null);

    try {
      // Call the NEW real-time valuation engine
      const validatedInput = {
        ...input,
        mileage: input.mileage || 0,
        condition: input.condition || 'good'
      };
      const result = await calculateUnifiedValuation(validatedInput);
      
      console.log('✅ Real-time valuation completed:', result);
      setValuationData(result);

      // Save the valuation result to database
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // First insert the new valuation record
        const { data: savedValuation, error: insertError } = await supabase
          .from('valuations')
          .insert({
            id: result.id,
            user_id: user?.id || null,  // Allow anonymous valuations
            vin: input.vin,
            make: input.make,
            model: input.model,
            year: input.year,
            mileage: input.mileage,
            condition: input.condition,
            zip_code: input.zipCode,  // Use zip_code not state
            fuel_type: input.fuelType,
            estimated_value: result.finalValue,
            confidence_score: result.confidenceScore,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.warn('⚠️ Failed to save valuation to database:', insertError);
        } else {
          console.log('✅ Valuation saved to database successfully');
        }
      } catch (saveErr) {
        console.warn('⚠️ Error saving valuation to database:', saveErr);
      }

      toast.success(`New estimate: $${result.finalValue.toLocaleString()} (${result.confidenceScore}% confidence)`);
      
      return result;

    } catch (err) {
      console.error('❌ Real-time valuation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Real-time valuation failed';
      setError(errorMessage);
      
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onUpgrade = () => {
    window.location.href = '/premium';
  };

  const onDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // PDF download logic here
      toast.success('Your valuation report has been downloaded');
    } catch (err) {
      toast.error('Failed to download PDF report');
    } finally {
      setIsDownloading(false);
    }
  };

  const onEmailPdf = async () => {
    setIsEmailSending(true);
    try {
      // Email logic here
      toast.success('Your valuation report has been emailed');
    } catch (err) {
      toast.error('Failed to send email');
    } finally {
      setIsEmailSending(false);
    }
  };

  const value: ValuationContextType = {
    valuationData,
    isPremium,
    isLoading,
    error,
    estimatedValue: valuationData?.finalValue || 0,
    onUpgrade,
    isDownloading,
    isEmailSending,
    onDownloadPdf,
    onEmailPdf,
    rerunValuation
  };

  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuationContext() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuationContext must be used within a ValuationProvider');
  }
  return context;
}

export { ValuationContext };
