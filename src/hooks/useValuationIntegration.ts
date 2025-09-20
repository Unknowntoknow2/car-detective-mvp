import { useState, useCallback } from 'react';
import { ValuationIntegrationService, ValuationPipelineResult } from '@/services/ValuationIntegrationService';
import { ValuationRequest, ValuationResult } from '@/types/vehicleData';
import { toast } from 'sonner';

interface UseValuationIntegrationOptions {
  tier?: 'free' | 'premium';
  autoCache?: boolean;
  maxCacheHours?: number;
}

interface UseValuationIntegrationReturn {
  isProcessing: boolean;
  progress: number;
  currentStage: string;
  result: ValuationPipelineResult | null;
  error: string | null;
  processVinToValuation: (vin: string, additionalData?: Partial<ValuationRequest>) => Promise<ValuationPipelineResult | null>;
  getCachedValuation: (vin: string) => Promise<void>;
  clearResults: () => void;
}

/**
 * Hook for managing the complete VIN to valuation pipeline
 * Provides progress tracking and state management for the integration flow
 */
export const useValuationIntegration = (
  options: UseValuationIntegrationOptions = {}
): UseValuationIntegrationReturn => {
  const {
    tier = 'free',
    autoCache = true,
    maxCacheHours = 168 // 7 days
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [result, setResult] = useState<ValuationPipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback((stage: string, progressValue: number) => {
    setCurrentStage(stage);
    setProgress(progressValue);
  }, []);

  const processVinToValuation = useCallback(async (
    vin: string,
    additionalData?: Partial<ValuationRequest>
  ): Promise<ValuationPipelineResult | null> => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      // Validate VIN first
      const validation = ValuationIntegrationService.validateVin(vin);
      if (!validation.valid) {
        setError(validation.error || 'Invalid VIN');
        toast.error(validation.error || 'Invalid VIN');
        return null;
      }

      updateProgress('Validating VIN...', 5);

      // Check for cached valuation if enabled
      if (autoCache) {
        updateProgress('Checking for cached valuation...', 10);
        const cached = await ValuationIntegrationService.getCachedValuationByVin(vin, maxCacheHours);
        
        if (cached) {
          updateProgress('Found cached valuation', 100);
          const cachedResult: ValuationPipelineResult = {
            success: true,
            requestId: cached.request_id,
            valuationResult: cached,
            auditTrail: [{
              stage: 'cached_result',
              timestamp: new Date().toISOString(),
              status: 'success',
              message: 'Using cached valuation result'
            }]
          };
          
          setResult(cachedResult);
          toast.success('Found recent valuation for this VIN');
          return cachedResult;
        }
      }

      updateProgress('Starting VIN decode...', 15);

      // Process the complete pipeline with progress tracking
      const pipelineResult = await ValuationIntegrationService.processVinToValuation(
        vin,
        additionalData,
        { tier, forceRefresh: false }
      );

      // Track progress based on audit trail
      if (pipelineResult.auditTrail) {
        const stages = [
          'vin_decode_start',
          'vin_decode_success', 
          'vin_enrichment_cached',
          'valuation_request_prepared',
          'valuation_request_created',
          'market_aggregation_success',
          'valuation_complete'
        ];

        pipelineResult.auditTrail.forEach((entry, index) => {
          const stageIndex = stages.indexOf(entry.stage);
          if (stageIndex >= 0) {
            const progressValue = Math.min(20 + (stageIndex * 12), 95);
            updateProgress(entry.message, progressValue);
          }
        });
      }

      if (pipelineResult.success) {
        updateProgress('Valuation complete!', 100);
        toast.success(`Valuation complete: $${pipelineResult.valuationResult?.estimated_value?.toLocaleString()}`);
        setResult(pipelineResult);
        return pipelineResult;
      } else {
        setError(pipelineResult.error || 'Valuation pipeline failed');
        toast.error(pipelineResult.error || 'Valuation pipeline failed');
        return null;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Valuation integration error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [tier, autoCache, maxCacheHours, updateProgress]);

  const getCachedValuation = useCallback(async (vin: string): Promise<void> => {
    try {
      const cached = await ValuationIntegrationService.getCachedValuationByVin(vin, maxCacheHours);
      
      if (cached) {
        const cachedResult: ValuationPipelineResult = {
          success: true,
          requestId: cached.request_id,
          valuationResult: cached,
          auditTrail: [{
            stage: 'cached_result',
            timestamp: new Date().toISOString(),
            status: 'success',
            message: 'Loaded cached valuation result'
          }]
        };
        
        setResult(cachedResult);
        toast.success('Loaded cached valuation');
      } else {
        toast.info('No recent valuation found for this VIN');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cached valuation';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [maxCacheHours]);

  const clearResults = useCallback(() => {
    setResult(null);
    setError(null);
    setProgress(0);
    setCurrentStage('');
  }, []);

  return {
    isProcessing,
    progress,
    currentStage,
    result,
    error,
    processVinToValuation,
    getCachedValuation,
    clearResults
  };
};

export default useValuationIntegration;