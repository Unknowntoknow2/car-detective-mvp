
import { useState } from 'react';
import { toast } from 'sonner';
import { generateValuationReport, buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { calculateValuation } from '@/utils/valuation/calculator';
import { ValuationParams, ValuationResult } from '@/types/valuation';

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
        isPremium
      };

      // Calculate valuation
      const valuationResult = await calculateValuation(extendedParams);

      // Generate the PDF report
      const reportResult = await buildValuationReport(extendedParams, valuationResult);

      // Update state with the valuation data and PDF URL
      setState({
        isLoading: false,
        data: valuationResult,
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult,
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
        isPremium: true
      };

      // Calculate valuation
      const valuationResult = await calculateValuation(premiumParams);

      // Generate premium report with additional options
      const reportResult = await buildValuationReport(premiumParams, valuationResult, options);

      // Update state with the premium data
      setState({
        isLoading: false,
        data: {
          ...valuationResult,
          estimatedValue: reportResult.estimatedValue,
          confidenceScore: reportResult.confidenceScore
        },
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult,
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
