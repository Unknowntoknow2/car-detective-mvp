import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { runValuation, type AinResponse, type AinMeta } from '@/lib/ainClient';
import { toast } from 'sonner';

// Define the result type that our context will use
interface ValuationResult {
  estimatedValue: number;
  finalValue: number;
  confidenceScore: number;
  breakdown?: any[];
  marketData?: Record<string, unknown>;
  explanation?: string;
  priceRange?: [number, number];
  baseValue?: number;
  adjustments?: any[];
  source: string;
  metadata?: AinMeta;
}

interface ValuationInput {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: number;
  zipCode?: string;
  condition?: string;
  fuelType?: string;
}

interface ValuationContextType {
  valuationData?: ValuationResult | null;
  isPremium: boolean;
  isLoading: boolean;
  error?: string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
  rerunValuation: (input: ValuationInput) => Promise<ValuationResult>;
}

// Singleton pattern to prevent duplicate contexts even with HMR
const GLOBAL_KEY = "__AIN_VALUATION_CONTEXT__";
const g = globalThis as any;
export const ValuationContext: React.Context<ValuationContextType | undefined> =
  g[GLOBAL_KEY] ?? (g[GLOBAL_KEY] = createContext<ValuationContextType | undefined>(undefined));

interface ValuationProviderProps {
  children: React.ReactNode;
  valuationId?: string;
}

export function ValuationProvider({ children, valuationId }: ValuationProviderProps) {
  const [valuationData, setValuationData] = useState<ValuationResult | null>(null);
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
      // First try to get valuation by VIN
      const { data: valuationByVin, error: vinError } = await supabase
        .from('valuations')
        .select('*')
        .eq('vin', id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (vinError) {
        console.error('❌ Error fetching valuation by VIN:', vinError);
        throw vinError;
      }

      let data = valuationByVin?.[0];

      // If not found by VIN, try by ID
      if (!data) {
        const { data: valuationById, error: idError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();

        if (idError && idError.code !== 'PGRST116') {
          console.error('❌ Error fetching valuation by ID:', idError);
          throw idError;
        }

        data = valuationById;
      }

      if (data) {
        // Convert database data to our context format
        const legacyResult: ValuationResult = {
          estimatedValue: data.estimated_value || 0,
          finalValue: data.estimated_value || 0,
          confidenceScore: data.confidence_score || 0,
          breakdown: data.adjustments || [],
          marketData: data.data_source || {},
          priceRange: data.price_range_low && data.price_range_high 
            ? [data.price_range_low, data.price_range_high] 
            : [0, 0],
          adjustments: [],
          baseValue: data.estimated_value,
          explanation: 'Legacy valuation data from database',
          source: 'database'
        };

        setValuationData(legacyResult);
      }
      setIsPremium(data?.premium_unlocked || false);

    } catch (err) {
      console.error('❌ Error loading valuation:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const rerunValuation = async (input: ValuationInput) => {
    console.log('🔄 [ValuationContext] Calling AIN API for professional valuation via rerunValuation:', input);
    setIsLoading(true);
    setError(null);

    try {
      const t0 = performance.now();
      const { data: ainResult, meta } = await runValuation({
        vin: input.vin,
        year: input.year,
        make: input.make,
        model: input.model,
        trim: input.trim,
        mileage: input.mileage ?? 0,
        zip_code: input.zipCode,
        condition: (input.condition as "poor" | "fair" | "good" | "very_good" | "excellent") ?? "good",
        requested_by: 'rerun_valuation'
      });
      
      console.log('✅ [AIN] Professional valuation completed via AIN API');
      console.log('🔍 [AIN] Route metadata:', meta);
      console.info("ain.val.ms", Math.round(performance.now()-t0), { route: meta.route, corr_id: meta.corr_id });
      
      // Convert AIN result to our expected format
      const result: ValuationResult = {
        estimatedValue: ainResult.estimated_value || 0,
        finalValue: ainResult.estimated_value || 0,
        confidenceScore: ainResult.confidence_score || 0,
        priceRange: [ainResult.price_range_low || 0, ainResult.price_range_high || 0],
        breakdown: ainResult.breakdown || [],
        marketData: ainResult.market_data || {},
        baseValue: ainResult.base_value || 0,
        adjustments: ainResult.adjustments || [],
        explanation: ainResult.explanation || 'Professional valuation from AIN API',
        source: 'ain',
        metadata: meta
      };
      
      // Set the engine result directly - no conversion needed
      setValuationData(result);

      // Save the valuation result to database
      try {
        const userId = 'anonymous';
        console.log('💾 [DEBUG] Saving valuation with user:', userId);
        console.log('💾 [DEBUG] Valuation data to save:', result);

        const { data: savedValuation, error: insertError } = await supabase
          .from('valuations')
          .insert({
            vin: input.vin || null,
            user_id: userId,
            make: input.make,
            model: input.model,
            year: input.year,
            mileage: input.mileage,
            condition: input.condition,
            zip_code: input.zipCode,
            fuel_type: input.fuelType,
            estimated_value: result.finalValue,
            confidence_score: result.confidenceScore,
            is_vin_lookup: true,  // Required field with default
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to save valuation to database:', insertError);
          console.error('❌ Insert error details:', JSON.stringify(insertError, null, 2));
        } else {
          console.log('✅ Valuation saved to database successfully:', savedValuation);
        }
      } catch (saveError) {
        console.error('❌ Database save error:', saveError);
      }

      return result;
    } catch (error) {
      console.error('❌ [ValuationContext] Rerun valuation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to calculate valuation: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onUpgrade = () => {
    console.log('🚀 Upgrade requested');
    // Implementation will be added when premium features are implemented
  };

  const onDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Implementation for PDF download
      console.log('📄 PDF download requested');
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const onEmailPdf = async () => {
    setIsEmailSending(true);
    try {
      // Implementation for email PDF
      console.log('📧 Email PDF requested');
    } catch (error) {
      console.error('❌ Email PDF failed:', error);
      toast.error('Failed to email PDF');
    } finally {
      setIsEmailSending(false);
    }
  };

  const contextValue: ValuationContextType = {
    valuationData,
    isPremium,
    isLoading,
    error,
    estimatedValue: valuationData?.estimatedValue || 0,
    onUpgrade,
    isDownloading,
    isEmailSending,
    onDownloadPdf,
    onEmailPdf,
    rerunValuation,
  };

  return (
    <ValuationContext.Provider value={contextValue}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuationContext() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    // Include module URL to catch mismatched imports fast
    throw new Error(`useValuationContext must be used within a ValuationProvider (module: ${import.meta.url})`);
  }
  return context;
}

// ValuationContext already exported above as singleton