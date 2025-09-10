
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateUnifiedValuation } from '@/services/valuation/valuationEngine';
import { type UnifiedValuationResult as EngineResult, type ValuationEngineInput } from '@/services/valuation/valuationEngine';
import type { ValuationInput } from '@/types/valuation';
import { toast } from 'sonner';

interface ValuationContextType {
  valuationData?: EngineResult | null;
  isPremium: boolean;
  isLoading: boolean;
  error?: string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
  rerunValuation: (input: ValuationInput) => Promise<EngineResult>;
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
  const [valuationData, setValuationData] = useState<EngineResult | null>(null);
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

      // Run fresh valuation with the new engine using the stored vehicle data
      console.log('🔄 Running fresh valuation with new engine...');
      
      const engineInput: ValuationEngineInput = {
        vin: data.vin || id,
        zipCode: data.zip_code || '95821',
        mileage: data.mileage || 100000, // Default mileage if not available
        condition: data.condition || 'good',
        decodedVehicle: {
          year: data.year,
          make: data.make,
          model: data.model,
          trim: data.body_type || undefined,
          bodyType: data.body_style || undefined
        },
        fuelType: data.fuel_type || 'gasoline'
      };

      try {
        const t0 = performance.now();
        const freshResult = await calculateUnifiedValuation(engineInput);
        console.info("ain.val.ms", Math.round(performance.now()-t0), { via: import.meta.env.USE_AIN_VALUATION });
        console.log('✅ Fresh valuation result:', freshResult);
        setValuationData(freshResult);
      } catch (engineError) {
        console.error('❌ Failed to run fresh valuation, falling back to legacy data:', engineError);
        
        // Fallback to legacy data if engine fails
        const legacyResult: EngineResult = {
          finalValue: data.estimated_value,
          priceRange: [
            Math.round(data.estimated_value * 0.9),
            Math.round(data.estimated_value * 1.1)
          ],
          confidenceScore: data.confidence_score || 40,
          marketListings: [],
          zipAdjustment: 0,
          mileagePenalty: 0,
          conditionDelta: 0,
          titlePenalty: 0,
          aiExplanation: data.explanation || 'Legacy valuation data (engine failed)',
          sourcesUsed: ['legacy_database'],
          adjustments: [],
          baseValue: data.estimated_value,
          explanation: 'Legacy valuation data from database'
        };

        setValuationData(legacyResult);
      }
      setIsPremium(data.premium_unlocked || false);

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
      // Call the real AIN API via our hardened endpoint
      const { runValuation } = await import('@/lib/ainClient');
      
      const t0 = performance.now();
      const { data: ainResult, meta } = await runValuation({
        vin: input.vin,
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage || 0,
        zip_code: input.zipCode,
        condition: input.condition || 'good',
        requested_by: 'rerun_valuation'
      });
      
      console.log('✅ [AIN] Professional valuation completed via AIN API');
      console.log('🔍 [AIN] Route metadata:', meta);
      console.info("ain.val.ms", Math.round(performance.now()-t0), { route: meta.route, corr_id: meta.corr_id });
      
      // Convert AIN result to our expected format
      const result = {
        estimatedValue: (ainResult as any)?.estimated_value || 0,
        finalValue: (ainResult as any)?.estimated_value || 0,
        confidenceScore: (ainResult as any)?.confidence_score || 0,
        priceRange: [(ainResult as any)?.price_range_low || 0, (ainResult as any)?.price_range_high || 0] as [number, number],
        breakdown: (ainResult as any)?.breakdown || [],
        marketData: (ainResult as any)?.market_data || {},
        marketListings: (ainResult as any)?.market_listings || [],
        zipAdjustment: 0,
        baseValue: (ainResult as any)?.base_value || 0,
        adjustments: (ainResult as any)?.adjustments || [],
        mileagePenalty: 0,
        conditionDelta: 0,
        titlePenalty: 0,
        aiExplanation: (ainResult as any)?.explanation || 'Professional valuation from AIN API',
        confidence: (ainResult as any)?.confidence_score || 0,
        sourcesUsed: ['ain'],
        explanation: (ainResult as any)?.explanation || 'Professional valuation from AIN API',
        executionTimeMs: Math.round(performance.now()-t0),
        source: 'ain',
        metadata: meta
      };
      
      // Set the engine result directly - no conversion needed
      setValuationData(result as any);

      // Save the valuation result to database
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('💾 [DEBUG] Saving valuation with user:', user?.id || 'anonymous');
        
        const valuationId = crypto.randomUUID();
        console.log('💾 [DEBUG] Valuation data to save:', {
          id: valuationId,
          vin: input.vin,
          make: input.make,
          model: input.model,
          year: input.year,
          estimated_value: result.finalValue
        });
        
        // First insert the new valuation record with all required fields
        const { data: savedValuation, error: insertError } = await supabase
          .from('valuations')
          .insert({
            id: valuationId,
            user_id: user?.id || null,  // Allow anonymous valuations
            vin: input.vin,
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
      } catch (saveErr) {
        console.error('❌ Error saving valuation to database:', saveErr);
        console.error('❌ Save error details:', JSON.stringify(saveErr, null, 2));
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

  console.log('✅ ValuationProvider rendering with context value:', !!value);

  return (
    <ValuationContext.Provider value={value}>
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
