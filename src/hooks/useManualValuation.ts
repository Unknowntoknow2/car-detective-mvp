import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateValuationReport, buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { calculateValuation } from '@/utils/valuation/calculator';
import { ValuationParams, ValuationResult } from '@/utils/valuation/types';
import { supabase } from '@/lib/supabaseClient';

export interface ManualVehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  features?: string[];
  valuation?: number;
}

export interface ManualValuationState {
  isLoading: boolean;
  data: ValuationResult | null;
  error: string | null;
  pdfUrl: string | null;
  isPdfGenerating: boolean;
}

export const useManualValuation = () => {
  const [state, setState] = useState<ManualValuationState>({
    isLoading: false,
    data: null,
    error: null,
    pdfUrl: null,
    isPdfGenerating: false
  });

  // Generate a valuation report for the given vehicle
  const generateReport = async (params: ValuationParams, isPremium: boolean = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Add isPremium to params
      const extendedParams = {
        ...params,
        isPremium,
        identifierType: 'manual' as 'vin' | 'plate' | 'manual' | 'photo'
      };

      // Calculate valuation
      const valuationResult = await calculateValuation(extendedParams);
      
      // Add required id field for compatibility with types
      const completeValuationResult = {
        ...valuationResult,
        id: crypto.randomUUID()
      };

      // Save to Supabase if user is authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save the valuation to the valuations table
          const { error } = await supabase
            .from('valuations')
            .insert({
              user_id: user.id,
              make: params.make,
              model: params.model,
              year: params.year,
              mileage: params.mileage,
              condition: params.condition,
              state: params.zipCode,
              estimated_value: valuationResult.estimatedValue,
              confidence_score: valuationResult.confidenceScore,
              is_vin_lookup: false,
              fuel_type: params.fuelType,
              transmission: params.transmission,
              body_style: params.bodyType,
              premium_unlocked: isPremium
            });
            
          if (error) {
            console.error('Error saving valuation to Supabase:', error);
          }
        }
      } catch (saveError) {
        console.error('Error saving to Supabase:', saveError);
        // Continue with the valuation process even if saving fails
      }

      // Generate the PDF report
      const reportResult = await buildValuationReport(extendedParams, completeValuationResult, {});

      // Update state with the valuation data and PDF URL
      setState({
        isLoading: false,
        data: completeValuationResult,
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult: completeValuationResult,
        reportResult
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate valuation';
      
      // Set error state
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfGenerating: false
      }));
      
      // Show error toast
      toast({
        title: "Valuation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  // Generate premium report with additional features
  const generatePremiumReport = async (params: ValuationParams, options = {}) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Add premium flag to params
      const premiumParams = {
        ...params,
        isPremium: true,
        identifierType: 'manual' as 'vin' | 'plate' | 'manual' | 'photo'
      };

      // Calculate valuation
      const valuationResult = await calculateValuation(premiumParams);
      
      // Add required id field for compatibility with types
      const completeValuationResult = {
        ...valuationResult,
        id: crypto.randomUUID()
      };

      // Save to Supabase if user is authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save the premium valuation to the valuations table
          const { data, error } = await supabase
            .from('valuations')
            .insert({
              user_id: user.id,
              make: params.make,
              model: params.model,
              year: params.year,
              mileage: params.mileage,
              condition: params.condition,
              state: params.zipCode,
              estimated_value: valuationResult.estimatedValue,
              confidence_score: valuationResult.confidenceScore,
              is_vin_lookup: false,
              fuel_type: params.fuelType,
              transmission: params.transmission,
              body_style: params.bodyType,
              premium_unlocked: true
            })
            .select()
            .single();
            
          if (error) {
            console.error('Error saving premium valuation to Supabase:', error);
          } else if (data) {
            // Add entry to premium_valuations table
            await supabase
              .from('premium_valuations')
              .insert({
                user_id: user.id,
                valuation_id: data.id
              });
          }
        }
      } catch (saveError) {
        console.error('Error saving premium data to Supabase:', saveError);
        // Continue with the valuation process even if saving fails
      }

      // Generate premium report with additional options
      const reportResult = await buildValuationReport(premiumParams, completeValuationResult, options);

      // Update state with the premium data
      setState({
        isLoading: false,
        data: {
          ...completeValuationResult,
          estimatedValue: reportResult.estimatedValue,
          confidenceScore: reportResult.confidenceScore
        },
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult: completeValuationResult,
        reportResult
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate premium valuation';
      
      // Set error state
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfGenerating: false
      }));
      
      // Show error toast
      toast({
        title: "Premium valuation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  return {
    ...state,
    generateReport,
    generatePremiumReport,
  };
};
