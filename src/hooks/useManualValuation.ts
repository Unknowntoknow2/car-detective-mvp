
import { useState } from 'react';
import { toast } from 'sonner';
import { generateValuationReport, buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { calculateValuation } from '@/utils/valuation/calculator';
import { ValuationParams, ValuationResult } from '@/utils/valuation/types';

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
      toast.error(`Valuation failed: ${errorMessage}`);
      
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
      toast.error(`Premium valuation failed: ${errorMessage}`);
      
      return null;
    }
  };

  return {
    ...state,
    generateReport,
    generatePremiumReport,
  };
};
