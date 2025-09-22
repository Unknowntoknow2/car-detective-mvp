import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { runValuation, type AinResponse, type AinMeta } from '@/lib/ainClient';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

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
    
    setIsLoading(true);
    setError(null);

    try {
      // First try to get valuation by VIN
      const { data: valuationByVin, error: vinError } = await supabase
        .from('valuation_results')
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
          .from('valuation_results')
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
        const estimatedValue = data.estimated_value ?? 0;
        const priceRange: [number, number] = [
          data.price_range_low ?? estimatedValue,
          data.price_range_high ?? estimatedValue,
        ];
        const adjustments = Array.isArray(data.adjustments) ? data.adjustments : [];

        const legacyResult: ValuationResult = {
          estimatedValue,
          finalValue: estimatedValue,
          confidenceScore: data.confidence_score ?? 0,
          breakdown: adjustments,
          marketData: (data.vehicle_data as Record<string, unknown> | null) ?? {},
          priceRange,
          adjustments,
          baseValue: estimatedValue,
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
      
      logger.log("ain.val.ms", Math.round(performance.now()-t0), { route: meta.route, corr_id: meta.corr_id });
      
      // Convert AIN result to our expected format
      const finalValue = ainResult.finalValue ?? ainResult.estimated_value ?? 0;
      const confidenceScore = ainResult.confidenceScore ?? ainResult.confidence_score ?? 0;
      const priceRange: [number, number] = ainResult.priceRange
        ? [ainResult.priceRange[0] ?? finalValue, ainResult.priceRange[1] ?? finalValue]
        : [ainResult.price_range_low ?? finalValue, ainResult.price_range_high ?? finalValue];
      const adjustments = ainResult.adjustments ?? ainResult.breakdown ?? [];
      const marketData = ainResult.market_data
        ?? ((ainResult.marketListingsCount !== undefined || ainResult.sourcesUsed)
          ? {
              market_listings_count: ainResult.marketListingsCount,
              sources_used: ainResult.sourcesUsed,
            }
          : {});

      const result: ValuationResult = {
        estimatedValue: finalValue,
        finalValue,
        confidenceScore,
        priceRange,
        breakdown: adjustments,
        marketData,
        baseValue: ainResult.base_value ?? finalValue,
        adjustments,
        explanation: ainResult.explanation || 'Professional valuation from AIN API',
        source: 'ain',
        metadata: meta
      };
      
      // Set the engine result directly - no conversion needed
      setValuationData(result);

      // Save the valuation result to database
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id ?? null;

        const { data: savedValuation, error: insertError } = await supabase
          .from('valuation_results')
          .insert({
            vin: input.vin || null,
            user_id: userId,
            make: input.make || 'Unknown',
            model: input.model || 'Unknown',
            year: input.year || new Date().getFullYear(),
            mileage: input.mileage ?? null,
            condition: input.condition,
            zip_code: input.zipCode,
            estimated_value: result.finalValue,
            confidence_score: result.confidenceScore,
            price_range_low: result.priceRange?.[0] ?? null,
            price_range_high: result.priceRange?.[1] ?? null,
            adjustments: result.adjustments,
            vehicle_data: {
              fuel_type: input.fuelType,
              source: 'rerun_valuation'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to save valuation to database:', insertError);
          console.error('❌ Insert error details:', JSON.stringify(insertError, null, 2));
        } else {
          
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
    // Implementation will be added when premium features are implemented
  };

  const onDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Implementation for PDF download
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const onEmailPdf = async () => {
    setIsEmailSending(true);
    try {
      // Implementation for email PDF
    } catch (error) {
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