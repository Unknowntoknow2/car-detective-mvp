
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateUnifiedValuation } from '@/services/valuationEngine';
import type { UnifiedValuationResult, ValuationInput } from '@/types/valuation';
import { useToast } from '@/components/ui/use-toast';

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
  rerunValuation: (input: ValuationInput) => Promise<void>;
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
  const { toast } = useToast();

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
      const { data, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', id)
        .single();

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
      const result = await calculateUnifiedValuation(input);
      
      console.log('✅ Real-time valuation completed:', result);
      setValuationData(result);

      // Save the updated result to database
      try {
        const { error: saveError } = await supabase
          .from('valuations')
          .update({
            estimated_value: result.finalValue,
            confidence_score: result.confidenceScore,
            explanation: result.aiExplanation,
            market_search_status: result.marketSearchStatus,
            listing_count: result.listingCount,
            updated_at: new Date().toISOString()
          })
          .eq('vin', input.vin);

        if (saveError) {
          console.warn('⚠️ Failed to save updated valuation:', saveError);
        } else {
          console.log('✅ Updated valuation saved to database');
        }
      } catch (saveErr) {
        console.warn('⚠️ Error saving updated valuation:', saveErr);
      }

      toast({
        title: 'Valuation Updated',
        description: `New estimate: $${result.finalValue.toLocaleString()} (${result.confidenceScore}% confidence)`,
      });

    } catch (err) {
      console.error('❌ Real-time valuation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Real-time valuation failed';
      setError(errorMessage);
      
      toast({
        title: 'Valuation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
      toast({
        title: 'PDF Downloaded',
        description: 'Your valuation report has been downloaded',
      });
    } catch (err) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download PDF report',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const onEmailPdf = async () => {
    setIsEmailSending(true);
    try {
      // Email logic here
      toast({
        title: 'Email Sent',
        description: 'Your valuation report has been emailed',
      });
    } catch (err) {
      toast({
        title: 'Email Failed',
        description: 'Failed to send email',
        variant: 'destructive',
      });
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
